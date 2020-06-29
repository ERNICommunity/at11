import cheerio from "cheerio";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { compareMenuItems, parsePrice } from "../parserUtil";

export class PizzaPazza implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = cheerio.load(html);
        const dayMenu = new Array<IMenuItem>();

        const menuItems = $(".group-menu-1, .group-menu-2");
        menuItems.each(function() {
            parseItems($(this));
        });

        dayMenu.sort(compareMenuItems);
        if (dayMenu.length >= 2 && dayMenu[0].text === dayMenu[1].text) {
            dayMenu.shift();
        }

        return Promise.resolve(dayMenu);

        function parseItems(item: Cheerio) {
            item.find("table tr").each((i, elem) => {
                const $this = $(elem);
                const nameCellText = $this.children("td").eq(1).text().trim();
                if (i === 0) {
                    const text = nameCellText.replace(/^polievka[\s:]*/i, "");
                    dayMenu.push({
                        isSoup: true,
                        text: normalize(text),
                        price: NaN
                    });
                } else {
                    const priceCellText = item.find("form .product_price").text().trim();
                    dayMenu.push({
                        isSoup: false,
                        text: normalize(nameCellText),
                        price: parsePrice(priceCellText).price
                    });
                }
            });
        }

        function normalize(str: string): string {
            return str.removeItemNumbering()
                .replace("/", " ")
                .normalizeWhitespace()
                .removeMetrics();
        }
    }
}
