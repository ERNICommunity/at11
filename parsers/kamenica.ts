import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";

export class Kamenica implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);

        const soupPattern = /0[.,]\d+\s?l?$/;
        const dayOfWeek = parseInt(date.format("e"), 10) + 1;

        const elements = $(".obedove-nadpis", "#content");
        let price = NaN;
        elements.eq(0).text().replace(/\d,\d{2}\s€/, (match) => {
            price = parseFloat(match.replace(",", "."));
            return "";
        });

        const items = new Array<string>();
        elements.eq(dayOfWeek).next().find("td").text()
        .split("\n").filter((item) => item.trim() !== "")
        .forEach((item) => {
            items.push(item);
        });

        // convert to menu item object
        const dayMenu: IMenuItem[] = items.map((item) => {
            const isSoup = soupPattern.test(item.trim());
            if (isSoup) {
                return { isSoup : true,
                    text: normalize(item.replace(soupPattern, "")),
                    price: NaN
                };
            } else {
                return { isSoup : true,
                    text: normalize(item),
                    price
                };
            }
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
