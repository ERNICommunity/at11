import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";

export class Kasa implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dayMenu = new Array<IMenuItem>();

        const dateStr = date.format("DD.MM.YYYY");

        const denneMenuElem = $(".dnesne_menu, .ostatne_menu").filter(function() {
            const nadpis = $(this).find("h2").text();
            return nadpis.indexOf(dateStr) > -1;
        });

        const soupElems = [];
        const mealElems = [];
        denneMenuElem.first().find(".jedlo_polozka").each(function(index) {
            const elem = $(this);
            if (index === 0) {
                soupElems.push(elem);
            } else {
                mealElems.push(elem);
            }
        });

        soupElems.forEach((elem) => {
            let text = normalize($(".left", elem).text());
            text = text.replace(/polievka:?\s*/, "");
            dayMenu.push({ isSoup: true, text, price: NaN });
        });

        mealElems.forEach((elem) => {
            const text = normalize($(".left", elem).text());
            const price = parseFloat($(".right", elem).text().trim());
            dayMenu.push({ isSoup: false, text, price });
        });

        doneCallback(dayMenu);

        function normalize(str: string): string {
            return str.normalizeWhitespace()
                .removeMetrics()
                .correctCommaSpacing()
                .removeItemNumbering()
                .removeAlergens();
        }
    }
}
