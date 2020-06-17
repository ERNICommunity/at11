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

const actions = new Map<string, ((date: moment.Moment, done: (result: ReturnType<Cache<Error | IMenuItem[]>["get"]>) => void) => void)>();
for (const location of config.restaurants.keys()) {
    for (const restaurant of config.restaurants.get(location)) {
        console.log("Processing:", restaurant);
        try {
            const id = location + "-" + restaurant.id;
            if (actions.has(id)) {
                throw new Error("Non unique id '" + id + "' provided within '" + location + "' restaurants");
            }
            actions.set(id, (date, doneCallback) => menuFetcher.fetchMenu(restaurant.urlFactory, date, restaurant.parser, doneCallback));
        } catch (e) {
            console.warn(e);
        }
    }
}

if (actions.size === 0) {
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
app.get("/:location?", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    const location = req.params.location || config.restaurants.keys().next().value; // use first location if not specified
    res.render(__dirname + "/../views/index.html", {
        locations: Array.from(config.restaurants.keys()).map(k => ({ name: k, selected: k === location})),
        restaurants: (config.restaurants.get(location) || []).map(x => ({
            id: location + "-" + x.id,
            name: x.name,
            url: x.urlFactory(moment())
        })),
        appInsightsKey: config.appInsightsInstrumentationKey
    });
});
app.get("/menu/:id", (req, res) => {
    const date = moment(req.query.date as string, "YYYY-M-D", true)
    if (!date.isValid()) {
        res.statusCode = 400;
        res.send("Missing/incorrect 'date' query parameter");
        return;
    }

    if (!actions.has(req.params.id)) {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found");
        return;
    }

    actions.get(req.params.id)(date, result => {
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
