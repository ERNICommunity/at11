import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";

export class Alfa implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dateStr = date.format("DD.MM.YYYY");

        const denneMenuElem = $(".dnesne_menu, .ostatne_menu").filter(() => {
            const nadpis = $(this).find("h2").text();
            return nadpis.indexOf(dateStr) > -1;
        });

        const soupElems = [];
        const mealElems = [];
        let pushingSoups = false;
        denneMenuElem.first().find(".jedlo_polozka").each(() => {
            const elem = $(this);
            const txt = elem.text().trim();

            if (txt === "Polievka") {
                pushingSoups = true;
                return;
            }
            if (txt === "Hlavné jedlá") {
                pushingSoups = false;
                return;
            }

            if (pushingSoups) {
                soupElems.push(elem);
            } else {
                mealElems.push(elem);
            }
        });

        const dayMenu = new Array<IMenuItem>();

        soupElems.forEach((elem) => {
            const text = this.normalize($(".left", elem).text());
            dayMenu.push({ isSoup: true, text, price: NaN });
        });

        mealElems.forEach((elem) => {
            const text = this.normalize($(".left", elem).text());
            const price = parseFloat($(".right", elem).text().trim());
            dayMenu.push({ isSoup: false, text, price });
        });

        doneCallback(dayMenu);

        function normalize(str: string) {
            return str.normalizeWhitespace()
                .removeMetrics()
                .correctCommaSpacing()
                .removeItemNumbering();
        }
    }
}
