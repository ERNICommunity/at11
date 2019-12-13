import * as appInsights from "applicationinsights";
import express from "express";
import hbs from "hbs";
import moment from "moment-timezone";

import { Cache } from "./cache";
import { Config } from "./config";
import { MenuFetcher } from "./menuFetcher";
import { IMenuItem } from "./parsers/IMenuItem";

console.debug("Initializing...");
const config = new Config();
const cache =  new Cache<IMenuItem[]>(config);
const menuFetcher = new MenuFetcher(config, cache);

appInsights.setup("aa2cd664-f5de-4e6a-ac99-cebb7f88ddfa");
appInsights.start();

const actions = new Array<(date: moment.Moment, done: (err: Error, result: ReturnType<Cache<IMenuItem[]>["get"]>) => void) => void>();
for (const restaurant of config.restaurants) {
    console.log("Processing:", restaurant);
    try {
        const id = restaurant.id;
        if (typeof actions[id] !== "undefined") {
            throw new Error("Non unique id '" + id + "' provided");
        }
        actions[id] = (date, doneCallback) => menuFetcher.fetchMenu(restaurant.url, date, restaurant.parser, doneCallback);
    } catch (e) {
        console.warn(e);
    }
}

if (actions.length === 0) {
    throw new Error("Actions initialization failed");
}

console.debug("Runtime setup...");
hbs.registerPartials(__dirname + "/../views/partials");
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
    res.render(__dirname + "/../views/index.html", { restaurants: config.restaurants.map(x => ({
        id: x.id,
        name: x.name,
        url: x.url(moment())
    })) });
});
app.get("/menu/:id", (req, res) => {
    if (typeof actions[req.params.id] === "undefined") {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found\n");
    } else {
        if (!req.query.date) {
            res.statusCode = 400;
            res.send("Missing date query parameter");
            return;
        }
        actions[req.params.id](moment(req.query.date, "YYYY-MM-DD"), (error, result) => {
            if (error) {
                res.statusCode = 500;
                res.send(error.toString());
            } else {
                res.json({ menu: result.value, timeago: moment(result.timestamp).fromNow() });
            }
        });
    }
});
app.listen(config.port, function(err) {
  if (err) {
      throw err;
  }
  const host = this.address().address;
  const port = this.address().port;

  console.info("Done, listening on http://%s:%s", host, port);
});
