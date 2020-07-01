import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { Menucka } from "../menucka";

export class SidliskovaPivarnicka extends Menucka implements IParser {
    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            menuItems.forEach(item=> {
                if (/^\d/.test(item.text)) { // meals start with numbers
                    item.text = item.text.removeItemNumbering();
                } else {
                    item.isSoup = true;
                    item.text = item.text.replace(/^polievka:?\s*/i, "");
                }
            });
        }

        return Promise.resolve(menuItems);
    }
 }
