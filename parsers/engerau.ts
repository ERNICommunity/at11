import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";
import { Zomato } from "./zomato";

export class Engerau extends Zomato implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {

        const menuItems = super.parseBase(html, date);

        let price = NaN;
        const dayMenu = menuItems.map((item) => {
            if (item.isSoup) {
              price = item.price;
              item.price = NaN;
            } else {
              item.price = price;
            }
            item.text = normalize(item.text);
            return item;
        });

        doneCallback(dayMenu);

        function normalize(str: string): string {
            return str.replace(/\*.*$/, "");
        }
    }
}
