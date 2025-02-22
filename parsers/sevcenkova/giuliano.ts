import { load } from "cheerio";

import { IMenuItem, IParser } from "../types";
import { getDateRegex, parsePrice } from "../parserUtil";

export class Giuliano implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = load(html);
        let dayMenu = new Array<IMenuItem>();
        const dateRegex = getDateRegex(date);

        $("table#denne-menu tr").each((i, elem) => {
            const $this = $(elem);
            const dateCellText = $this.children("td").first().text();

            if (dateRegex.test(dateCellText)) {
                const foodCell = $this.children("td").eq(1);
                dayMenu = this.parseMeals(foodCell);

                const priceCell = $this.children("td").eq(2);
                const prices = this.parsePrices(priceCell);

                for (let x = 1; x < dayMenu.length; x++) {
                    dayMenu[x].price = prices[x - 1] || NaN;
                }

                return false;
            }
        });

        return dayMenu;
    }

    private parseMeals(cell: cheerio.Cheerio): IMenuItem[] {
        const items = new Array<IMenuItem>();
        cell.text().split("\n").map(str => str.trim()).filter(str => str.length > 0).forEach((str, i) => {
            if (i === 0 ) {
                items.push({ isSoup: true, price: NaN, text: this.normalize(str) });
                return;
            }
            if (str === "Špeciálna ponuka:") {
                return;
            }
            items.push({ isSoup: false, price: NaN, text: this.normalize(str) });
        });
        return items;
    }

    private parsePrices(cell: cheerio.Cheerio): number[] {
        const items = new Array<number>();
        cell.text().split("\n").map(str => str.trim()).filter(str => str.length > 0).forEach((str, i) => {
            if (str === "Špeciálna ponuka:") {
                return;
            }
            items.push(parsePrice(str).price);
        });
        return items;
    }

    private normalize(str: string) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .removeAlergens();
    }
}
