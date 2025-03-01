import * as appInsights from "applicationinsights";
import express from "express";
import hbs from "hbs";
import NodeCache from "node-cache";

import { Config } from "./config";
import { MenuFetcher, IMenuResult } from "./menuFetcher";
import { sk } from "date-fns/locale";
import { formatDistance, parse, isValid } from "date-fns";

console.debug("Initializing...");
const config = new Config();
const cache =  new NodeCache({
    checkperiod: (config.cacheExpiration / 2)
});
const menuFetcher = new MenuFetcher(config, cache);

if (config.appInsightsConnectionString) {
    appInsights.setup(config.appInsightsConnectionString).setAutoCollectConsole(true, true);
    appInsights.start();
}

const actions = new Map<string, (date: Date) => Promise<IMenuResult>>();
for (const location of config.restaurants.keys()) {
    for (const restaurant of config.restaurants.get(location)) {
        console.log(`Processing: ${location}/${restaurant.id} - ${restaurant.name}`);
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
    const location = req.params.location || config.restaurants.keys().next().value; // use first location if not specified
    res.render(__dirname + "/../views/index.html", {
        locations: [...config.restaurants.keys()].map(k => ({ name: k, selected: k === location })),
        restaurants: config.restaurants.get(location).map(x => ({
            id: location + "-" + x.id,
            name: x.name,
            url: x.urlFactory(new Date())
        })),
        appInsightsConnectionString: config.appInsightsConnectionString
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
    if (result.type === "error") {
        res.status(500).json({ error: result.error, timeago });
    } else {
        res.json({ menu: result.menu, timeago });
    }
});
const server = app.listen(config.port, () => {
  console.info("Done, listening on", server.address());
});
