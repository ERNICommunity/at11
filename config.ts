import { Moment } from "moment-timezone";

import { Alfa } from "./parsers/alfa";
import { Engerau } from "./parsers/engerau";
import { Giuliano } from "./parsers/giuliano";
import { HallOfKings } from "./parsers/hallofkings";
import { IParser } from "./parsers/IParser";
import { Itb } from "./parsers/itb";
import { Kamenica } from "./parsers/kamenica";
import { Kasa } from "./parsers/kasa";
import { Lokalka } from "./parsers/lokalka";
import { Particka } from "./parsers/particka";
import { PizzaPazza } from "./parsers/pizzapazza";
import { Skolka } from "./parsers/skolka";
import { Tiffany } from "./parsers/tiffany";
import { Klubovna } from "./parsers/klubovna";

export interface IConfig {
    readonly isProduction: boolean;
    readonly scraperApiKey: string;
    readonly appInsightsInstrumentationKey: string;
    readonly port: number;
    readonly bypassCache: boolean;
    readonly cacheExpiration: number;
    readonly requestTimeout: number;
    readonly parserTimeout: number;
    readonly restaurants: Map<string, Readonly<{ id: number, name: string, urlFactory: (date: Moment) => string, parser: IParser}>[]>;
}

export class Config implements IConfig {
    public readonly isProduction = process.env.NODE_ENV === "production";
    public readonly scraperApiKey = process.env.SCRAPER_API_KEY;
    public readonly appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    public readonly port: number = process.env.PORT as unknown as number || 54321;
    public readonly bypassCache: boolean = process.env.AT11_NO_CACHE === "true";
    public readonly cacheExpiration = 2 * 60 * 60 * 1000; // 2h
    public readonly requestTimeout = 15 * 1000; // 15s
    public readonly parserTimeout = 15 * 1000; // 15s
    public readonly restaurants = new Map<string, Readonly<{ id: number, name: string, urlFactory: (date: Moment) => string, parser: IParser}>[]>([ // tslint:disable: max-line-length
        ["einpark", [
            { id: 1, name: "Clock Block", urlFactory: _ => "https://restauracie.sme.sk/restauracia/clock-block_8537-petrzalka_664/denne-menu", parser: new Kasa() }
        ]],
        ["sevcenkova", [
            { id: 1, name: "Kaša", urlFactory: _ => "https://restauracie.sme.sk/restauracia/kasa-2_8386-petrzalka_664/denne-menu", parser: new Kasa() },
            { id: 2, name: "ITB", urlFactory: _ => "http://www.citycantina.sk/prevadzka/1", parser: new Itb() },
            { id: 3, name: "Partička", urlFactory: _ => "https://restauracie.sme.sk/restauracia/particka-restauracia-beer-pub_11101-petrzalka_664/denne-menu", parser: new Particka() },
            { id: 4, name: "Alfa", urlFactory: _ => "http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu", parser: new Alfa() },
            { id: 5, name: "Hall of Kings", urlFactory: _ => "https://menucka.sk/denne-menu/bratislava/hall-of-kings", parser: new HallOfKings() },
            { id: 6, name: "Škôlka", urlFactory: _ => "http://jedalen.vysnivany.sk/ukazka-strany", parser: new Skolka() },
            { id: 7, name: "Giuliano", urlFactory: _ => "http://www.giuliano.sk/-denne-menu", parser: new Giuliano() },
            { id: 8, name: "Pizza Pazza", urlFactory: date => `https://www.pizzeriaviennagate.sk/obedove-menu/${date.format("dddd").replace("š", "s").replace("ľ", "l")}`, parser: new PizzaPazza() },
            { id: 9, name: "Kamenica - Corleone Pizza", urlFactory: _ => "http://www.pizzacorleone.sk/obedove-menu.html", parser: new Kamenica() },
            { id: 10, name: "Engerau restaurant", urlFactory: _ => "https://www.zomato.com/sk/bratislava/engerau-restaurant-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Engerau() },
            { id: 11, name: "Lokálka", urlFactory: _ => "http://www.lokalka.sk/kopcianska-2/", parser: new Lokalka() },
            { id: 12, name: "Tiffany", urlFactory: _ => "https://www.zomato.com/sk/bratislava/pizzeria-tiffany-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Tiffany() },
            { id: 13, name: "Petržalská klubovňa", urlFactory: _ => "https://restauracie.sme.sk/restauracia/petrzalska-klubovna_7359-petrzalka_664/denne-menu", parser: new Klubovna() }
        ]]
    ])
}
