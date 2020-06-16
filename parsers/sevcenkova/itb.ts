import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import "../parserUtil";
import { compareMenuItems } from "../parserUtil";

export class Itb implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dayMenu = new Array<IMenuItem>();

        const todayNameRegex = new RegExp(date.format("dddd"), "i");
        const tomorrowNameRegex = new RegExp(date.clone().add(1, "days").format("dddd"), "i");

        const menuRows = $(".tabularmenu").children("div.one-third, div.one-third-last, h2");
        let foundCurrentDay = false;
        menuRows.each((index, element) => {
            const $row = $(element);
            const text = $row.eq(0).text();
            if (tomorrowNameRegex.test(text)) {
                return false;
            }
            if (foundCurrentDay) {
                const meal = parseMeal($row);
                if (meal !== null) {
                    dayMenu.push(meal);
                }
            }
            if (todayNameRegex.test(text)) {
                foundCurrentDay = true;
            }
        });

        dayMenu.sort(compareMenuItems);

        doneCallback(dayMenu);

        function parseMeal(tablerow: Cheerio): IMenuItem {
            if (tablerow.find("li").length === 0) {
                return null;
            }
            if (tablerow.text().trim() === "()") { // empty meal
                return null;
            }
            const menuItem: IMenuItem = { price: NaN, isSoup: false, text: "" };
            menuItem.isSoup = /polievka/i.test(tablerow.children("h3").text());
            const textParts = tablerow.find("li").children("span").eq(1)[0].children;
            const mergedText = textParts.length > 1 ? $(textParts[0]).text() + "," + $(textParts[2]).text() : $(textParts[0]).text();
            if (mergedText.trim() === "()") { // empty meal
                return null;
            }
            menuItem.text = normalize(mergedText);
            menuItem.price = parseFloat(tablerow.find("li").children("span").eq(0).text().replace(/,/, "."));

            return menuItem;
        }

        function removeTrailingAlergens(str: string) {
            return str.trim().replace(/,?\s*alerg.*/i, "").trim();
        }

        function normalize(str: string) {
            return removeTrailingAlergens(str.normalizeWhitespace()
                .removeItemNumbering()
                .removeMetrics()
                .toLowerCase()
                .capitalizeFirstLetter());
        }
    }
}
