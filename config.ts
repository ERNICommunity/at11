import { IParser } from "./parsers/types";

import { Alfa } from "./parsers/sevcenkova/alfa";
import { Engerau } from "./parsers/sevcenkova/engerau";
import { Giuliano } from "./parsers/sevcenkova/giuliano";
import { HallOfKings } from "./parsers/sevcenkova/hallofkings";
import { Itb } from "./parsers/sevcenkova/itb";
import { Kamenica } from "./parsers/sevcenkova/kamenica";
import { Lokalka } from "./parsers/sevcenkova/lokalka";
import { Klubovna } from "./parsers/sevcenkova/klubovna";
import { ClockBlock } from "./parsers/einpark/clockblock";
import { DerbyPub } from "./parsers/einpark/derbypub";
import { MKMRestaurant } from "./parsers/einpark/mkmrestaurant";

/* eslint-disable max-len */
export interface IConfig {
    readonly isProduction: boolean;
    readonly scraperApiKey: string;
    readonly appInsightsConnectionString: string;
    readonly port: number;
    readonly bypassCache: boolean;
    readonly cacheExpiration: number;
    readonly requestTimeout: number;
    readonly parserTimeout: number;
    readonly restaurants: ReadonlyMap<string, ReadonlyArray<{id: number, name: string, urlFactory: (date: Date) => string, parser: IParser}>>;
}

export class Config implements IConfig {
    public readonly isProduction = process.env.NODE_ENV === "production";
    public readonly scraperApiKey = process.env.SCRAPER_API_KEY;
    public readonly appInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    public readonly port = process.env.PORT as unknown as number || 54321;
    public readonly bypassCache = process.env.AT11_NO_CACHE === "true";
    public readonly cacheExpiration = 2 * 60 * 60; // 2h
    public readonly requestTimeout = 15 * 1000; // 15s
    public readonly parserTimeout = 15 * 1000; // 15s
    public readonly restaurants = new Map<string, ReadonlyArray<{ id: number, name: string, urlFactory: (date: Date) => string, parser: IParser}>>([
        ["einpark", [
            { id: 1, name: "Clock Block", urlFactory: _ => "https://restauracie.sme.sk/restauracia/clock-block_8537-petrzalka_664/denne-menu", parser: new ClockBlock() },
            { id: 2, name: "Derby Pub", urlFactory: _ => "https://www.derbypub.sk/menu/obedove-menu", parser: new DerbyPub() },
            { id: 3, name: "MKM Restaurant", urlFactory: _ => "https://restauracie.sme.sk/restauracia/mkm-pizzeria_1742-petrzalka_664/denne-menu", parser: new MKMRestaurant() }
        ]],
        ["ševčenkova", [
            { id: 2, name: "ITB", urlFactory: _ => "http://www.citycantina.sk/prevadzka/1", parser: new Itb() },
            { id: 4, name: "Alfa", urlFactory: _ => "http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu", parser: new Alfa() },
            { id: 5, name: "Hall of Kings", urlFactory: _ => "https://menucka.sk/denne-menu/bratislava/hall-of-kings", parser: new HallOfKings() },
            { id: 7, name: "Giuliano", urlFactory: _ => "http://www.giuliano.sk/-denne-menu", parser: new Giuliano() },
            { id: 9, name: "Kamenica - Corleone Pizza", urlFactory: _ => "http://www.pizzacorleone.sk/obedove-menu.html", parser: new Kamenica() },
            { id: 10, name: "Engerau restaurant", urlFactory: _ => "https://www.engerau.sk/denne-menu", parser: new Engerau() },
            { id: 11, name: "Lokálka", urlFactory: _ => "http://www.lokalka.sk/kopcianska-2/", parser: new Lokalka() },
            { id: 13, name: "Petržalská klubovňa", urlFactory: _ => "https://restauracie.sme.sk/restauracia/petrzalska-klubovna_7359-petrzalka_664/denne-menu", parser: new Klubovna() }
        ]]
    ]);
}
