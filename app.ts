import * as appInsights from "applicationinsights";
import express from "express";
import hbs from "hbs";
import moment from "moment-timezone";

import { Cache } from "./cache";
import { Config } from "./config";
import { MenuFetcher } from "./menuFetcher";
import { IMenuItem } from "./parsers/IMenuItem";
import { isError } from "util";

console.debug("Initializing...");
const config = new Config();
const cache =  new Cache<Error | IMenuItem[]>(config);
const menuFetcher = new MenuFetcher(config, cache);

if (config.appInsightsInstrumentationKey) {
    appInsights.setup(config.appInsightsInstrumentationKey);
    appInsights.start();
}

const actions: ((date: moment.Moment, done: (result: ReturnType<Cache<Error | IMenuItem[]>["get"]>) => void) => void)[] = [];
for (const restaurant of config.restaurants) {
    console.log("Processing:", restaurant);
    try {
        const id = restaurant.id;
        if (typeof actions[id] !== "undefined") {
            throw new Error("Non unique id '" + id + "' provided");
        }
        actions[id] = (date, doneCallback) => menuFetcher.fetchMenu(restaurant.urlFactory, date, restaurant.parser, doneCallback);
    } catch (e) {
        console.warn(e);
    }
}

if (actions.length === 0) {
    throw new Error("Actions initialization failed");
}

console.debug("Runtime setup...");
moment.locale("sk");
moment.tz.setDefault("Europe/Bratislava");

console.debug("Express setup...");
const app = express();
app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.static(__dirname + "/../static"));
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    res.render(__dirname + "/../views/index.html", {
        restaurants: config.restaurants.map(x => ({
            id: x.id,
            name: x.name,
            url: x.urlFactory(moment())
        })),
        appInsightsKey: config.appInsightsInstrumentationKey
    });
});
app.get("/menu/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)) {
        res.statusCode = 400;
        res.send("Missing/incorrect 'id' url parameter");
        return;
    }

    const date = moment(req.query.date, "YYYY-M-D", true)
    if (!date.isValid()) {
        res.statusCode = 400;
        res.send("Missing/incorrect 'date' query parameter");
        return;
    }

    if (typeof actions[id] === "undefined") {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found");
        return;
    }

    actions[id](date, result => {
        if (isError(result.value)) {
            res.status(500).json({ error: result.value.toString(), timeago: moment(result.timestamp).fromNow() });
        } else {
            res.json({ menu: result.value, timeago: moment(result.timestamp).fromNow() });
        }
    });
});
app.listen(config.port, function(err) {
  if (err) {
      throw err;
  }
  const host = this.address().address;
  const port = this.address().port;

  console.info("Done, listening on http://%s:%s", host, port);
});
