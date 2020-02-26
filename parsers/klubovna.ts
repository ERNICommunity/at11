import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";
import { getDateRegex, parsePrice } from "./parserUtil";

export class Klubovna implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dateRegex = getDateRegex(date);

        const denneMenuElem = $(".dnesne_menu, .ostatne_menu").filter((i, elem) => {
            const nadpis = $(elem).find("h2").text();
            return dateRegex.test(nadpis);
        });

        const dayMenu = new Array<IMenuItem>();

        denneMenuElem.first().find(".jedlo_polozka").each((i, elem) => {
            const txt = $(elem).text().trim()
            .replace(/\([0-9,]+\)/g, "")
            .replace(/Polievka \|/, "")
            .replace(/Menu.*polievkou \|/, "")     
            .replace(/\(obsahuje\:/, "");       

            if (i === 0) {
                return;
            }

            if (i === 2) { // item is soup
                dayMenu.push({ isSoup: true, text: normalize(txt), price: NaN });
                return;
            }

            const result = parsePrice(txt);
            dayMenu.push({ isSoup: false, text: normalize(result.text), price: result.price });
        });

        doneCallback(dayMenu);

        function normalize(str: string) {
            return str.toLowerCase()
                .removeMetrics()
                .removeAlergens()
                .correctCommaSpacing()
                .removeItemNumbering()
                .capitalizeFirstLetter()
                .replace(/[\s–]+$/, "");
        }
    }
}
