import * as appInsights from "applicationinsights";
import express from "express";
import hbs from "hbs";
import NodeCache from "node-cache";

import { Config } from "./config.js";
import { MenuFetcher, IMenuResult } from "./menuFetcher.js";
import { sk } from "date-fns/locale";
import { formatDistance, parse, isValid } from "date-fns";

const config = new Config();
if (config.appInsightsConnectionString) {
    appInsights
        .setup(config.appInsightsConnectionString)
        .setAutoCollectConsole(true, true)
        .setDistributedTracingMode(
            appInsights.DistributedTracingModes.AI_AND_W3C,
        )
        .start();
}

console.debug("Initializing...");
const cache = new NodeCache({
    checkperiod: config.cacheExpiration / 2,
});
const menuFetcher = new MenuFetcher(config, cache);

const actions = new Map<string, (date: Date) => Promise<IMenuResult>>();
for (const [key, value] of Object.entries(config.restaurants)) {
    console.debug(`Processing '${key}': ${value.name}`);
    actions.set(key, (date) => menuFetcher.fetchMenu(date, value.parser));
}

if (actions.size === 0) {
    throw new Error("Actions initialization failed");
}

console.debug("Express setup...");
const app = express();
app.set("view engine", "html");
// eslint-disable-next-line @typescript-eslint/unbound-method
app.engine("html", hbs.__express);
app.use(express.static(import.meta.dirname + "/../static"));
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    const now = new Date();
    res.render(import.meta.dirname + "/../views/index.html", {
        restaurants: Object.entries(config.restaurants).map(([k, v]) => ({
            id: k,
            name: v.name,
            url: v.parser.urlFactory(now),
        })),
        appInsightsConnectionString: config.appInsightsConnectionString,
    });
});
app.get("/menu/:key", async (req, res) => {
    const date = parse(req.query.date as string, "yyyy-M-d", new Date(), {
        locale: sk,
    });
    if (!isValid(date)) {
        res.statusCode = 400;
        res.send("Missing/incorrect 'date' query parameter");
        return;
    }

    if (!actions.has(req.params.key)) {
        res.statusCode = 404;
        res.send(`Restaurant action for '${req.params.key}' not found`);
        return;
    }

    const result = await actions.get(req.params.key)!(date);
    const timeago = formatDistance(result.timestamp, new Date(), {
        addSuffix: true,
        locale: sk,
    });
    if (result.type === "error") {
        res.status(500).json({ error: result.error, timeago });
    } else {
        res.json({ menu: result.menu, timeago });
    }
});
const server = app.listen(config.port, () => {
    console.info("Done, listening on", server.address());
});
