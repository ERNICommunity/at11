import * as appInsights from "applicationinsights";
import express from "express";
import hbs from "hbs";
import { types } from "util";
import { sk } from "date-fns/locale";
import { formatDistance, parse, isValid } from "date-fns";

import { config, Location } from "./config";
import { MenuFetcher, IMenuResult } from "./menuFetcher";

/* eslint-disable no-console */

console.debug("Initializing...");

const menuFetcher = new MenuFetcher();

if (config.applicationInsights.instrumentationKey) {
    appInsights.setup(config.applicationInsights.instrumentationKey).setAutoCollectConsole(true, true);
    appInsights.start();
}

const actions = new Map<string, ((date: Date) => Promise<IMenuResult>)>();
for (const location of config.restaurants.keys()) {
    for (const restaurant of config.restaurants.get(location)) {
        console.log("Processing:", restaurant);
        try {
            const id = location + "-" + restaurant.id;
            if (actions.has(id)) {
                throw new Error("Non unique id '" + id + "' provided within '" + location + "' restaurants");
            }
            actions.set(id, (date) => menuFetcher.fetchMenu(restaurant.urlFactory, date, restaurant.parser));
        } catch (e) {
            console.warn(e);
        }
    }
}

if (actions.size === 0) {
    throw new Error("Actions initialization failed");
}

console.debug("Express setup...");
const app = express();
app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.static(__dirname + "/../static"));
app.get("/:location?", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    const location: Location = (req.params.location ?? config.restaurants.keys().next().value); // use first location if not specified
    res.render(__dirname + "/../views/index.html", {
        locations: Array.from(config.restaurants.keys()).map(key => ({ name: key, selected: key === location })),
        restaurants: (config.restaurants.get(location) ?? []).map(x => ({
            id: location + "-" + x.id,
            name: x.name,
            url: x.urlFactory(new Date())
        })),
        appInsightsKey: config.applicationInsights.instrumentationKey
    });
});
app.get("/menu/:id", async (req, res) => {
    const date = parse(req.query.date as string, "yyyy-M-d", new Date());
    if (!isValid(date)) {
        res.statusCode = 400;
        res.send("Missing/incorrect 'date' query parameter");
        return;
    }

    if (!actions.has(req.params.id)) {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found");
        return;
    }

    const result = await actions.get(req.params.id)(date);
    const timeago = formatDistance(result.timestamp, new Date(), { addSuffix: true, locale: sk });
    if (types.isNativeError(result.value)) {
        res.status(500).json({ error: result.value.toString(), timeago });
    } else {
        res.json({ menu: result.value, timeago });
    }
});
app.listen(config.port, function() {
  const host = this.address().address;
  const port = this.address().port;

  console.info("Done, listening on http://%s:%s", host, port);
});
