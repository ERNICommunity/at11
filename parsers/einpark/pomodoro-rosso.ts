import { load } from "cheerio";

import { IMenuItem, IParser } from "../types";
import { addDays, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { sk } from "date-fns/locale";
import { parsePrice } from "../parserUtil";

export class PomodoroRosso implements IParser {
    public urlFactory(d: Date): string {
        const weekStart = startOfWeek(d, { locale: sk });
        const dayBeforeStart = subDays(weekStart, 1);
        const weekEnd = endOfWeek(d, { locale: sk });
        const fridayBeforeEnd = subDays(weekEnd, 2);
        return (
            "https://www.pizzeriapomodororosso.sk/" +
            format(dayBeforeStart, "yyyy/MM/dd", { locale: sk }) +
            `/denne-menu-${format(weekStart, "d-M-yyyy", { locale: sk })}-${format(fridayBeforeEnd, "d-M-yyyy", { locale: sk })}/`
        );
    }

    public parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = load(html);
        const currentDayName = format(date, "eeee", { locale: sk });
        const nextDayName = format(addDays(date, 1), "eeee", { locale: sk });

        const allMenuText = $("article.post.tag-denne-menu .entry-content")
            .find("br")
            .replaceWith("\n")
            .end()
            .text()
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean);

        return Promise.resolve(
            this.parseDailyMenu(allMenuText, currentDayName, nextDayName),
        );
    }

    private parseDailyMenu(
        rows: string[],
        currentDay: string,
        nextDay: string,
    ): IMenuItem[] {
        const menu: IMenuItem[] = [];

        const current = new RegExp(currentDay, "i");
        const next = new RegExp(nextDay, "i");
        const note = new RegExp("Cena denného menu", "i");

        let dailyMenuStarted = false;
        for (const r of rows) {
            if (!dailyMenuStarted && current.test(r)) {
                dailyMenuStarted = true;
                continue;
            }
            if (dailyMenuStarted && (next.test(r) || note.test(r))) {
                break;
            }
            if (dailyMenuStarted) {
                if (/Polievka/i.test(r)) {
                    menu.push(this.parseSoup(r));
                } else {
                    menu.push(this.parseOther(r));
                }
            }
        }

        return menu;
    }

    private parseSoup(row: string): IMenuItem {
        const text = row.replace(/Polievka:?/i, "").trim();
        return { isSoup: true, text: this.normalize(text), price: NaN };
    }

    private parseOther(row: string): IMenuItem {
        const { text, price } = parsePrice(row);
        return {
            isSoup: false,
            text: this.normalize(text.replace("//", "").trim()),
            price,
        };
    }

    private normalize(str: string) {
        return str
            .removeMetrics()
            .removeItemNumbering()
            .capitalizeFirstLetter();
    }
}
