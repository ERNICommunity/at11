import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Zomato } from "../zomato";

export class Tiffany extends Zomato implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            const soups = menuItems[0].text.replace(/^\s*[Pp]oli?evk[ay]\s*:\s*-\s*/, "").replace(/\s*\(0[.,]25l?\)\s*$/, "").split(",");
            menuItems.shift();
            for (const soup of soups) {
                menuItems.unshift({ isSoup: true, text: soup, price: NaN });
            }
            menuItems[menuItems.length - 1].isSoup = false; // last item is misidentified as soup
        }

        return Promise.resolve(menuItems);
    }
}
