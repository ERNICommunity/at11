import cheerio from "cheerio";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { format } from "date-fns";

export class Kamenica implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = cheerio.load(html);

        const soupPattern = /0[.,]\d+\s?l/;
        const dayOfWeek = Number(format(date, "i"));

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
                return { isSoup : false,
                    text: normalize(item),
                    price
                };
            }
        });

        return Promise.resolve(dayMenu);

        function normalize(str: string) {
            return str.normalizeWhitespace()
                .removeMetrics()
                .removeItemNumbering()
                .removeAlergens();
        }
    }
}
