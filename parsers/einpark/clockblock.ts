import { Moment } from "moment-timezone";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";
import { parsePrice } from "../parserUtil";

export class ClockBlock extends Sme implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const menuItems = super.parseBase(html, date);

        if(menuItems.length > 0) {
            // first 2 items are soups
            menuItems[0].isSoup = true;
            menuItems[1].isSoup = true;
            menuItems.forEach(item=> {
                const result = parsePrice(item.text);
                item.price = result.price;
                item.text = result.text.replace(/^.*\|\s+/, "").replace(/\(obsahuje:/, "");
            });
        }

        doneCallback(menuItems);
    }
}
