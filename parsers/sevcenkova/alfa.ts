import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";

export class Alfa extends Sme implements IParser {
    public parse(html: string, date: Date, doneCallback: (menu: IMenuItem[]) => void): void {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first 2 items are soup
            menuItems[0].isSoup = true;
            menuItems[1].isSoup = true;
        }

        doneCallback(menuItems);
    }
}
