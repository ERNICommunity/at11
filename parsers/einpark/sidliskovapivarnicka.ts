import { Moment } from "moment-timezone";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import "../parserUtil";
import { Menucka } from "../menucka";

export class SidliskovaPivarnicka extends Menucka implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const menuItems = super.parseBase(html, date);

        if(menuItems.length > 0) {
            menuItems.forEach(item=> {
                if(/^\d/.test(item.text)) { // meals start with numbers
                    item.text = item.text.removeItemNumbering();
                } else {
                    item.isSoup = true;
                    item.text = item.text.replace(/^polievka:?\s*/i, "");
                }
            })
        }

        doneCallback(menuItems);
    }
 }
