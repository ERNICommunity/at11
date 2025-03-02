import { load } from "cheerio";

import { IMenuItem } from "../types";
import { getDateRegex } from "../parserUtil";


export abstract class Menucka {
    protected parseBase(html: string, date: Date): IMenuItem[] {
        const $ = load(html);
        const dateRegex = getDateRegex(date);

        const dayMenu = new Array<IMenuItem>();

        let currentDay: cheerio.Cheerio;
        let nextDay: cheerio.Cheerio;
        $(".day-title").each((i, elem) => {
            const node =  $(elem);
            if (currentDay) {
                nextDay = node.parent();
                return false;
            }
            const dateText = node.text().trim();
            if (dateRegex.test(dateText)) {
                currentDay = node.parent();
            }
        }).parent();

        const menuElems = currentDay.nextUntil(nextDay);
        for (let i = 0; i < menuElems.length; i+=2) {
            const text = menuElems.eq(i).text().trim();
            if (!text) {
                continue;
            }
            const price = parseFloat(menuElems.eq(i+1).text().trim().replace(",", "."));
            dayMenu.push({ isSoup: false, text, price });
        }
        return dayMenu;
    }
}
