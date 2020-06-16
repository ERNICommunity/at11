import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import "../parserUtil";

export class HallOfKings implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dayMenu = new Array<IMenuItem>();

        const dateStr = date.format("DD.MM.YYYY");

        const dayTitle = $(".day-title").filter(function() {
            const title = $(this).text();
            return title.indexOf(dateStr) > -1;
        }).parent();

        const soups = this.parseSoups(dayTitle);
        const meals = this.parseMeals(dayTitle);

        soups.forEach((soup) => {
            dayMenu.push({ isSoup: true, text: soup.text, price: soup.price });
        });
        meals.forEach((meal) => {
            dayMenu.push({ isSoup: false, text: meal.text, price: meal.price });
        });

        doneCallback(dayMenu);
    }

    private  parseSoups(dayTitle: Cheerio) {
        const soupsElem = dayTitle.next();
        const soups = soupsElem.text()
            .replace("Polievka", "")
            .replace(/\([0-9,]+\)/g, "")
            .split("/")
            .map((soup) => {
                soup = soup.normalizeWhitespace();
                return { text: soup, price: NaN };
            });

        return soups;
    }

    private parseMeals(dayTitle: Cheerio) {
        const meals = [];
        const defaultMenuPrice = dayTitle.next().next().text().replace(/,/, ".").trim();
        let elem = dayTitle.next().next();

        for (let i = 0; i < 6; i++) {
            const mealElem = elem.next();
            const meal = mealElem.text()
                .replace(/MENU [1-9]/, "")
                .normalizeWhitespace();

            const priceElem = mealElem.next();
            let price;

            if (i < 5) {
                if (/\S/.test(priceElem.text())) {
                    price = priceElem.text().replace(/,/, ".").trim();
                } else {
                    price = defaultMenuPrice;
                }
            } else {
                price = NaN;
            }

            meals.push({ text: meal, price: parseFloat(price) });
            elem = mealElem.next();
        }

        return meals;
    }
}
