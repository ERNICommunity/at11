import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";
import { parsePrice } from "../parserUtil";

export class ClassicRestaurantPub extends Sme implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first item is soup
            menuItems[0].isSoup = true;
            menuItems[0].text = menuItems[0].text.replace(/^polievka:?\s*/i, "").replace("rozvoz", "");
            menuItems.forEach(item=> {
                const result = parsePrice(item.text);
                item.price = result.price;
                item.text = result.text.trim().replace(/\/$/, "").removeAlergens().replace(/^menu\s*\d:?\s*/i, "");
            });
        }

        return Promise.resolve(menuItems);
    }
}
