import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";
import { compareMenuItems, parsePrice } from "./parserUtil";

export class PizzaPazza implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dayMenu = new Array<IMenuItem>();

        const menuItems = $("form.productDetail");
        menuItems.each(function() {
            parseItem($(this));
        });

        dayMenu.sort(compareMenuItems);

        doneCallback(dayMenu);

        function parseItem(item: Cheerio) {
            const itemParent = item.parent();
            const name = itemParent.find("h2.MainTitle").text();
            if (name) {
                const nameParts = name.split("   ");
                const food = normalize(nameParts[0]);
                const foodPrice = parsePrice(itemParent.find("div.product_price").text()).price;
                const soup = normalize(nameParts[1]);

                dayMenu.push({
                    isSoup: false,
                    text: food,
                    price: foodPrice
                });

                if (!dayMenuContainsSoup(soup)) {
                    dayMenu.push({
                        isSoup: true,
                        text: soup,
                        price: NaN
                    });
                }
            }
        }

        function dayMenuContainsSoup(soup) {
            return dayMenu.filter((e) =>  e.text === soup).length > 0;
        }

        function normalize(str: string): string {
            return str.removeItemNumbering()
                .replace("/", " ")
                .normalizeWhitespace()
                .removeMetrics()
                .correctCommaSpacing();
        }
    }
}
