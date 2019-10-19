import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";

export class Giuliano implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html, { normalizeWhitespace: true });
        const dayMenu = new Array<IMenuItem>();

        $("table#denne-menu tr").each(function() {
            const $this = $(this);
            const dateCellText = $this.children("td").first().text();

            if (dateCellText.indexOf(date.format("DD.M.YYYY")) > -1 || dateCellText.indexOf(date.format("DD.MM.YYYY")) > -1) {
                const items = $this.children("td").eq(1).children().filter(function() {
                    const txt = $(this).text().trim();
                    if (txt === "") {
                        return false;
                    }
                    const cnt: any = cheerio.load(txt);
                    cnt.root().contents()
                    .filter(function() { return this.type === "comment"; })
                    .remove(); // strip comments
                    return cnt.text().trim() !== "";
                });

                const priceText = $this.children("td").eq(2).text();
                const price = parseFloat(priceText.replace(",", "."));

                Array.prototype.forEach.call(items, (item, index) => {
                    const tmp = { isSoup: false, text: normalize($(item).text()), price };
                    if (index === 0) {// I think it is safe enough to assume that the first item in menu is the soup
                        tmp.isSoup = true;
                        tmp.price = NaN;
                    }
                    dayMenu.push(tmp);
                });

                return false;
            }
        });

        doneCallback(dayMenu);

        function normalize(str) {
            return str.normalizeWhitespace()
                .removeMetrics()
                .correctCommaSpacing();
        }
    }
}
