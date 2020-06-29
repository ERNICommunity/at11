import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Sme } from "../sme";
import { parsePrice } from "../parserUtil";

export class Particka extends Sme  implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first item are soups
            const soups = menuItems[0].text.split("/");
            menuItems.shift();

            // prices are in text
            menuItems.forEach(item => {
               const result = parsePrice(item.text);
               item.price = result.price;
               item.text = capitalizeFirstLetter(result.text.toLowerCase());
            });

            soups.forEach(value => {
                const text = value.trim();
                if (text !== "") {
                    menuItems.unshift({ isSoup: true, text: capitalizeFirstLetter(text.toLowerCase()), price: NaN });
                }
            });
        }

        return Promise.resolve(menuItems);

        function capitalizeFirstLetter(text: string) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    }
}
