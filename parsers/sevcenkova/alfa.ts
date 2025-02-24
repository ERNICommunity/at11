import { IMenuItem, IParser } from "../types";
import { Sme } from "../common/sme";

export class Alfa extends Sme implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first 2 items are soup
            menuItems[0].isSoup = true;
            menuItems[1].isSoup = true;
        }

        return menuItems;
    }
}
