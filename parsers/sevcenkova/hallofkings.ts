import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Menucka } from "../menucka";

export class HallOfKings extends Menucka implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first item are soups
            const soups = menuItems[0].text.replace(/^polievka:?\s*/i, "").split("/");
            menuItems.shift();

            // prices are in text
            menuItems.forEach(item => {
               item.text = item.text.replace(/^MENU \d\s*/i, "");
            });

            soups.forEach(value => {
                const text = value.trim();
                if (text !== "") {
                    menuItems.unshift({ isSoup: true, text: text.removeAlergens(), price: NaN });
                }
            });
        }

        return Promise.resolve(menuItems);
    }
}
