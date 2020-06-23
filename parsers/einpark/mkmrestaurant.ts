import { Moment } from "moment-timezone";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";
import { parsePrice } from "../parserUtil";
import "../parserUtil";

export class MKMRestaurant extends Sme implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const menuItems = super.parseBase(html, date);

        if(menuItems.length > 0) {
            // first item is soup
            menuItems[0].isSoup = true;
            menuItems.forEach(item=> {
                const result = parsePrice(item.text);
                item.price = result.price;
                item.text = result.text.removeMetrics();
            });
        }

        doneCallback(menuItems);
    }
}
