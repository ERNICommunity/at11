import { load } from "cheerio";

import { IMenuItem } from "./IMenuItem";
import { parsePrice } from "./parserUtil";
import { format } from "date-fns";
import { sk } from "date-fns/locale";


export abstract class Zomato {
    protected parseBase(html: string, date: Date): IMenuItem[] {
        const $ = load(html);
        const dayMenu = new Array<IMenuItem>();

        $("#daily-menu-container").find(".tmi-group").each(function() {
            const $this = $(this);

            const dayText = $this.children(".tmi-group-name").text();
            const dayName = getDayName(dayText);

            if (dayName === format(date, "EEEE", { locale: sk })) {
                $this.children(".tmi-daily").each(function() {
                    let text = $(this).find(".tmi-name").text().trim();
                    let price = parseFloat($(this).find(".tmi-price").text().replace(/,/, "."));
                    if (isNaN(price)) {// price probably directly in text, extract it
                        const result = parsePrice(text);
                        text = result.text;
                        price = result.price;
                    }

                    if (!/^\d\s?[.,]?/.test(text)) { // soups dont have numbering
                        text.split("/").forEach((item) => {
                            dayMenu.push({ isSoup: true, text: item.trim(), price });
                        });
                    } else {
                        dayMenu.push({ isSoup: false, text: normalize(text), price });
                    }
                });
                return false;
            }
        });

        return dayMenu;

        function getDayName(text: string): string {
            const found = text.trim().match(/^(.+),/);
            if (!found || found.length < 1) {
                return null;
            }
            return found[1].toLowerCase();
        }

        function normalize(str: string) {
            return str.removeItemNumbering()
                .removeMetrics()
                .removeAlergens()
                .replace(/A\s(\d\s?[.,]?\s?)+$/, "")
                .normalizeWhitespace();
        }
    }
}
