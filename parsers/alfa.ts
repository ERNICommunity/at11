import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";
import { getDateRegex } from "./parserUtil";

export class Alfa implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const todayRegex = getDateRegex(date);

        const denneMenuElem = $(".dnesne_menu, .ostatne_menu").filter((i, elem) => {
            const nadpis = $(elem).find("h2").text();
            return todayRegex.test(nadpis);
        });

        const soupElems = [];
        const mealElems = [];
        denneMenuElem.first().find(".jedlo_polozka").each((i, elem) => {
            if (i < 2) {
                soupElems.push(elem);
            } else {
                mealElems.push(elem);
            }
        });

        const dayMenu = new Array<IMenuItem>();

        soupElems.forEach((elem) => {
            const text = normalize($(".left", elem).text());
            dayMenu.push({ isSoup: true, text, price: NaN });
        });

        mealElems.forEach((elem) => {
            const text = normalize($(".left", elem).text());
            const price = parseFloat($(".right", elem).text().trim());
            dayMenu.push({ isSoup: false, text, price });
        });

        doneCallback(dayMenu);

        function normalize(str: string) {
            return str.normalizeWhitespace()
                .removeMetrics()
                .correctCommaSpacing()
                .removeItemNumbering()
                .removeAlergens();
        }
    }
}
