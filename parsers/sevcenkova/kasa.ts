import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";

export class Kasa extends Sme implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first item is soup
            menuItems[0].isSoup = true;
            menuItems[0].text = menuItems[0].text.replace(/polievka:?\s*/, "");
        }

        return Promise.resolve(menuItems);
    }
}
