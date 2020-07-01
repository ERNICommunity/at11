import { format } from "date-fns";
import { sk } from "date-fns/locale";

import { IParser } from "./parsers/IParser";

import { Alfa } from "./parsers/sevcenkova/alfa";
import { Engerau } from "./parsers/sevcenkova/engerau";
import { Giuliano } from "./parsers/sevcenkova/giuliano";
import { HallOfKings } from "./parsers/sevcenkova/hallofkings";
import { Itb } from "./parsers/sevcenkova/itb";
import { Kamenica } from "./parsers/sevcenkova/kamenica";
import { Kasa } from "./parsers/sevcenkova/kasa";
import { Lokalka } from "./parsers/sevcenkova/lokalka";
import { Particka } from "./parsers/sevcenkova/particka";
import { PizzaPazza } from "./parsers/sevcenkova/pizzapazza";
import { Skolka } from "./parsers/sevcenkova/skolka";
import { Tiffany } from "./parsers/sevcenkova/tiffany";
import { Klubovna } from "./parsers/sevcenkova/klubovna";
import { ClockBlock } from "./parsers/einpark/clockblock";
import { DerbyPub } from "./parsers/einpark/derbypub";
import { MKMRestaurant } from "./parsers/einpark/mkmrestaurant";
import { ClassicRestaurantPub } from "./parsers/einpark/classicrestaurantpub";
import { SidliskovaPivarnicka } from "./parsers/einpark/sidliskovapivarnicka";

/* eslint-disable max-len */

export type Location = "einpark" | "ševčenkova";
type RestaurantMap = ReadonlyMap<Location, ReadonlyArray<{ id: number, name: string, urlFactory: (date: Date) => string, parser: IParser }>>;

/**
 * Here add new restaurant for given location
 */
const restaurants: RestaurantMap = new Map([
    ["einpark", [
        { id: 1, name: "Clock Block", urlFactory: _ => "https://restauracie.sme.sk/restauracia/clock-block_8537-petrzalka_664/denne-menu", parser: new ClockBlock() },
        { id: 2, name: "Derby Pub", urlFactory: _ => "https://www.derbypub.sk/menu/obedove-menu", parser: new DerbyPub() },
        { id: 3, name: "MKM Restaurant", urlFactory: _ => "https://restauracie.sme.sk/restauracia/mkm-pizzeria_1742-petrzalka_664/denne-menu", parser: new MKMRestaurant() },
        { id: 4, name: "Classic restaurant & pub", urlFactory: _ => "https://restauracie.sme.sk/restauracia/classic-restaurant-pub_626-petrzalka_664/denne-menu", parser: new ClassicRestaurantPub() },
        { id: 5, name: "Sídlisková pivárnička", urlFactory: _ => "https://menucka.sk/denne-menu/bratislava/sidliskova-pivarnicka", parser: new SidliskovaPivarnicka() }
    ]],
    ["ševčenkova", [
        { id: 1, name: "Kaša", urlFactory: _ => "https://restauracie.sme.sk/restauracia/kasa-2_8386-petrzalka_664/denne-menu", parser: new Kasa() },
        { id: 2, name: "ITB", urlFactory: _ => "http://www.citycantina.sk/prevadzka/1", parser: new Itb() },
        { id: 3, name: "Partička", urlFactory: _ => "https://restauracie.sme.sk/restauracia/particka-restauracia-beer-pub_11101-petrzalka_664/denne-menu", parser: new Particka() },
        { id: 4, name: "Alfa", urlFactory: _ => "http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu", parser: new Alfa() },
        { id: 5, name: "Hall of Kings", urlFactory: _ => "https://menucka.sk/denne-menu/bratislava/hall-of-kings", parser: new HallOfKings() },
        { id: 6, name: "Škôlka", urlFactory: _ => "http://jedalen.vysnivany.sk/ukazka-strany", parser: new Skolka() },
        { id: 7, name: "Giuliano", urlFactory: _ => "http://www.giuliano.sk/-denne-menu", parser: new Giuliano() },
        { id: 8, name: "Pizza Pazza", urlFactory: date => `https://www.pizzeriaviennagate.sk/obedove-menu/${format(date, "EEEE", { locale: sk }).replace("š", "s").replace("ľ", "l")}`, parser: new PizzaPazza() },
        { id: 9, name: "Kamenica - Corleone Pizza", urlFactory: _ => "http://www.pizzacorleone.sk/obedove-menu.html", parser: new Kamenica() },
        { id: 10, name: "Engerau restaurant", urlFactory: _ => "https://www.zomato.com/sk/bratislava/engerau-restaurant-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Engerau() },
        { id: 11, name: "Lokálka", urlFactory: _ => "http://www.lokalka.sk/kopcianska-2/", parser: new Lokalka() },
        { id: 12, name: "Tiffany", urlFactory: _ => "https://www.zomato.com/sk/bratislava/pizzeria-tiffany-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Tiffany() },
        { id: 13, name: "Petržalská klubovňa", urlFactory: _ => "https://restauracie.sme.sk/restauracia/petrzalska-klubovna_7359-petrzalka_664/denne-menu", parser: new Klubovna() }
    ]]
]);

export interface IConfig {
    isProduction: boolean,
    scraper: {
        endpoint: string,
        apiKey: string
    },
    applicationInsights: {
        instrumentationKey: string
    },
    port: number,
    cache: {
        bypassCache: boolean,
        expirationTime: number
    },
    requestTimeout: number,
    parserTimeout: number,
    ocr: {
        endpoint: string,
        timeout: number
    },
    restaurants: RestaurantMap;
}

export const config: IConfig = {
    isProduction: process.env.NODE_ENV === "production",
    scraper: {
        endpoint: "http://api.scraperapi.com",
        apiKey: process.env.SCRAPER_API_KEY
    },
    applicationInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    },
    port: Number(process.env.PORT) || 54321,
    cache: {
        bypassCache: process.env.AT11_NO_CACHE === "true",
        expirationTime: 2 * 60 * 60 // 2h in seconds
    },
    requestTimeout: 15 * 1_000, // 15s in millis
    parserTimeout: 15 * 1_000, // 15s in millis
    ocr: {
        endpoint: "https://at11ocr.azurewebsites.net/api/process",
        timeout: 25 * 1_000 // 25s in millis
    },
    restaurants
};
