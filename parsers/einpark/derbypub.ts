import { load } from "cheerio";

import { IMenuItem, IParser } from "../types";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

export class DerbyPub implements IParser {
    public readonly urlFactory = () => "https://www.derbypub.sk/menu/obedove-menu";

    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = load(html);
        const dayMenu = new Array<IMenuItem>();
        const todayText = format(date, "d. LLLL yyyy", { locale: sk });

        $(".pm-date-sub").each((i, elem) => {
            const node = $(elem);
            const text = node.text().trim();
            if (todayText === text) {
                parseDailyMenu(node.nextAll(".pm-item").first().find("table"));
                return false;
            }
        });

        return dayMenu;

        function parseDailyMenu(table: cheerio.Cheerio) {
            const rows = table.find("tr");
            rows.each((index, elem) => {
                if (index === 0) {
                    dayMenu.push(parseSoup(elem));
                } else {
                    dayMenu.push(parseOther(elem));
                }
            });
        }

        function parseSoup(row: cheerio.Element): IMenuItem {
            const cells = $(row).find("td");
            const text = cells.eq(2).text().trim();
            return { isSoup: true, text: normalize(text), price: NaN };
        }

        function parseOther(row: cheerio.Element): IMenuItem {
            const cells = $(row).find("td");
            const text = cells.eq(2).text().trim();
            const price = parseFloat(cells.eq(4).text().replace(",", "."));
            return { isSoup: false, text: normalize(text), price };
        }

        function normalize(str: string) {
            return str.removeAlergens()
                .removeMetrics()
                .capitalizeFirstLetter();
        }
    }
 }
