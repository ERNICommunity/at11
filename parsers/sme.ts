import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import "./parserUtil";
import { getDateRegex } from "./parserUtil";


export abstract class Sme {
    protected parseBase(html: string, date: Moment): IMenuItem[] {
        const $ = cheerio.load(html);
        const dateRegex = getDateRegex(date);

        const denneMenuElem = $(".dnesne_menu, .ostatne_menu").filter((i, elem) => {
            const nadpis = $(elem).find("h2").text();
            return dateRegex.test(nadpis);
        });

        const items = new Array<IMenuItem>();

        denneMenuElem.first().find(".jedlo_polozka").each((i, elem) => {
            const text = normalize($(".left", elem).text());
            const price = parseFloat($(".right", elem).text().trim());
            items.push({ text, price, isSoup: false });
        });

        return items;

        function normalize(str: string): string {
            return str.normalizeWhitespace()
                .removeMetrics()
                .removeItemNumbering()
                .capitalizeFirstLetter()
                .removeAlergens();
        }
    }
}
