import * as express from "express";
import * as hbs from "hbs";
import * as moment from "moment-timezone";

import { Cache } from "./cache";
import { Config } from "./config";
import { MenuFetcher } from "./menuFetcher";
import { IParser } from "./parsers/IParser";
import { MenuItem } from "./parsers/MenuItem";

console.log("Initializing...");

const config = new Config();
const cache =  new Cache<MenuItem[]>(config)
const menuFetcher = new MenuFetcher(config, cache, process.env.AT11_NO_CACHE ? true : false);

const actions = new Array<(date: moment.Moment, done: (err: Error, result: ReturnType<Cache<MenuItem[]>["get"]>) => void) => void>();
for (let i = 0; i < config.restaurants.length; i++) {
    console.log("Processing:", config.restaurants[i]);
    try {
        const parser = require("./parsers/" + config.restaurants[i].parserName) as IParser;
        const id = config.restaurants[i].id;
        if (typeof actions[id] !== "undefined") {
            throw new Error("Non unique id '" + id + "' provided");
        }
        const url = config.restaurants[i].url;
        actions[id] = (date, doneCallback) => menuFetcher.fetchMenu(url, date, parser.parse, doneCallback);
    } catch (e) {
        console.warn(e);
    }
}

if (Object.keys(actions).length === 0) {
    console.error("Initialization failed, exiting");
    process.exit(1);
}
console.log("Initialization successful (" + Object.keys(actions).length + " of " + config.restaurants.length + ")");

console.log("Registering partials...");
hbs.registerPartials(__dirname + "/views/partials");
console.log("Done");

console.log("Global setup...");
moment.locale("sk");
moment.tz.setDefault("Europe/Bratislava");
console.log("Done");

console.log("Express setup...");
const app = express();
app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.static("static"));
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    res.render("../views/index.html", { restaurants: config.restaurants });
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
console.log("Done");

console.log("Creating server...");
app.listen(config.port, (err) => {
  if (err) {
      console.error("Unable to create server", err);
      process.exit(1);
      return;
  }
  const host = this.address().address;
  const port = this.address().port;

  console.log("Done, listening on http://%s:%s", host, port);
});
