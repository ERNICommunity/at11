import cheerio from "cheerio";
import { Moment } from "moment-timezone";

import { IMenuItem } from "./IMenuItem";
import { IParser } from "./IParser";
import "./parserUtil";

export class Zomato implements IParser {
    public parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void {
        const $ = cheerio.load(html);
        const dayMenu = [];

        $("#daily-menu-container").find(".tmi-group").each(function() {
            const $this = $(this);

            const text = $this.children(".tmi-group-name").text();
            const day = getDay(text);

            if (day === date.format("dddd")) {
                $this.children(".tmi-daily").each(function() {
                    let text = $(this).find(".tmi-name").text().trim();
                    let price = parseFloat($(this).find(".tmi-price").text().replace(/,/, "."));
                    if (isNaN(price)) {// price probably directly in text, extract it
                        text = text.replace(/\d[.,]\d{2}$/, (match) => {
                            price = parseFloat(match.replace(",", "."));
                            return "";
                        });
                    }

                    if (!/^\d\s?[.,]/.test(text)) { // soups dont have numbering
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

        doneCallback(dayMenu);

        function getDay(text: string): string {
            const found = text.trim().match(/^(.+),/);
            if (!found || found.length < 1) {
                return null;
            }
            return found[1].toLowerCase();
        }

        function normalize(str: string) {
            return str.removeItemNumbering()
                .removeMetrics()
                .replace(/A\s(\d\s?[.,]?\s?)+$/, "")
                .correctCommaSpacing()
                .normalizeWhitespace();
        }
    }
}
