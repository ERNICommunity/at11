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

if (config.isProductionEnvironmnet) {
    appInsights.setup();
    appInsights.start();
}

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
    res.render(__dirname + "/../views/index.html", { restaurants: config.restaurants });
});
app.get("/menu/:id/:day", (req, res) => {
    if (typeof actions[req.params.id] === "undefined") {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found\n");
    } else {
        actions[req.params.id](moment(req.params.day, "YYYY-MM-DD"), (error, cachedMenu) => {
            if (error) {
                res.statusCode = 500;
                res.send(error.toString());
            } else {
                res.json(cachedMenu ? { menu: cachedMenu.value, timeago: moment(cachedMenu.timestamp).fromNow() } : null);
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
