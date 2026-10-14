import { IParser } from "./parsers/types.js";
import { DerbyPub } from "./parsers/einpark/derbypub.js";
import { MKMRestaurant } from "./parsers/einpark/mkmrestaurant.js";
import { PomodoroRosso } from "./parsers/einpark/pomodoro-rosso.js";

export interface IConfig {
    readonly skipScraperApi: boolean;
    readonly scraperApiKey?: string;
    readonly appInsightsConnectionString?: string;
    readonly port: number;
    readonly bypassCache: boolean;
    readonly cacheExpiration: number;
    readonly requestTimeout: number;
    readonly parserTimeout: number;
    readonly restaurants: Record<string, { name: string; parser: IParser }>;
}

export class Config implements IConfig {
    public readonly skipScraperApi = process.env.SKIP_SCRAPER_API === "true";
    public readonly scraperApiKey = process.env.SCRAPER_API_KEY;
    public readonly appInsightsConnectionString =
        process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    public readonly port = (process.env.PORT as unknown as number) || 54321;
    public readonly bypassCache = process.env.AT11_NO_CACHE === "true";
    public readonly cacheExpiration = 3 * 60 * 60; // 3h
    public readonly requestTimeout = 15 * 1000; // 15s
    public readonly parserTimeout = 15 * 1000; // 15s
    public readonly restaurants = {
        derby: { name: "Derby Pub", parser: new DerbyPub() },
        mkm: { name: "MKM Restaurant", parser: new MKMRestaurant() },
        "pomodoro-rosso": {
            name: "Pomodoro Rosso",
            parser: new PomodoroRosso(),
        },
    };
}
