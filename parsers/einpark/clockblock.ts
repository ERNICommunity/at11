import { IMenuItem, IParser } from "../types";
import { Sme } from "../common/sme";
import { parsePrice } from "../parserUtil";

export class ClockBlock extends Sme implements IParser {
    public readonly urlFactory = () =>
        "https://restauracie.sme.sk/restauracia/clock-block_8537-petrzalka_664/denne-menu";

    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const menuItems = super.parseBase(html, date);

        if (menuItems.length > 0) {
            // first 2 items are soups
            menuItems[0].isSoup = true;
            menuItems[1].isSoup = true;
            menuItems.forEach((item) => {
                const result = parsePrice(item.text);
                item.price = result.price;
                item.text = result.text
                    .replace(/^.*\|\s+/, "")
                    .replace(/\(obsahuje:/, "");
            });
        }

        return Promise.resolve(menuItems);
    }
}
