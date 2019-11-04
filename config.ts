import { Alfa } from "./parsers/alfa";
import { Engerau } from "./parsers/engerau";
import { Giuliano } from "./parsers/giuliano";
import { HallOfKings } from "./parsers/hallofkings";
import { IParser } from "./parsers/IParser";
import { Itb } from "./parsers/itb";
import { Kamenica } from "./parsers/kamenica";
import { Kasa } from "./parsers/kasa";
import { Lokalka } from "./parsers/lokalka";
import { PizzaPazza } from "./parsers/pizzapazza";
import { Skolka } from "./parsers/skolka";
import { Tiffany } from "./parsers/tiffany";

export interface IConfig {
    readonly port: number;
    readonly bypassCache: boolean;
    readonly cacheExpiration: number;
    readonly parserTimeout: number;
    readonly restaurants: Array<{ id: number, name: string, url: string, parser: IParser}>;
}

export class Config implements IConfig {
    public readonly port: number = process.env.PORT as unknown as number || 54321;
    public readonly bypassCache: boolean = process.env.AT11_NO_CACHE === "true";
    public readonly cacheExpiration = 2 * 60 * 60 * 1000; // 2h
    public readonly parserTimeout = 10 * 1000; // 10s
    public readonly restaurants: Array<{ id: number, name: string, url: string, parser: IParser}>  = [
        // tslint:disable: max-line-length
        { id: 11, name: "Kaša", url: "https://restauracie.sme.sk/restauracia/kasa-2_8386-petrzalka_664/denne-menu", parser: new Kasa() },
        { id: 3, name: "ITB", url: "http://www.citycantina.sk/prevadzka/1", parser: new Itb() },
        { id: 4, name: "Alfa", url: "http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu", parser: new Alfa() },
        { id: 12, name: "Hall of Kings", url: "https://menucka.sk/denne-menu/bratislava/hall-of-kings", parser: new HallOfKings() },
        { id: 5, name: "Škôlka", url: "http://jedalen.vysnivany.sk/ukazka-strany", parser: new Skolka() },
        { id: 2, name: "Giuliano", url: "http://www.giuliano.sk/-denne-menu", parser: new Giuliano() },
        { id: 6, name: "Pizza Pazza", url: "https://www.pizzeriaviennagate.sk/", parser: new PizzaPazza() },
        { id: 7, name: "Kamenica - Corleone Pizza", url: "http://www.pizzacorleone.sk/obedove-menu.html", parser: new Kamenica() },
        { id: 9, name: "Engerau restaurant", url: "https://www.zomato.com/sk/bratislava/engerau-restaurant-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Engerau() },
        { id: 10, name: "Lokálka", url: "http://www.lokalka.sk/kopcianska-2/", parser: new Lokalka() },
        { id: 13, name: "Tiffany", url: "https://www.zomato.com/sk/bratislava/pizzeria-tiffany-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu", parser: new Tiffany() }
    ];
}
