import { IMenuItem, IParser } from "../types";
import { Sme } from "../common/sme";
import { parsePrice } from "../parserUtil";

export class MKMRestaurant extends Sme implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first item is soup
            menuItems[0].isSoup = true;
            menuItems.forEach(item=> {
                const result = parsePrice(item.text);
                item.price = result.price;
                item.text = result.text.removeMetrics();
            });
        }

        return menuItems;
    }
}
