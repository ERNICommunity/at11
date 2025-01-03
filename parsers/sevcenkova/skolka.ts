import { load } from "cheerio";
import axios from "axios";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { getDateRegex, parsePrice } from "../parserUtil";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

export class Skolka implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = load(html);

        const dateReg = getDateRegex(date);
        const todayNameReg = new RegExp(`^\\s*${format(date, "EEEE", { locale: sk })}`, "i");

        const pic = $(".entry-content img");
        const link = $(".entry-content a").filter(function () {
            return $(this).text() !== "" && !/<a/.test($(this).html());
        });

        if (pic.length === 0 && link.length > 0) {
            const pdfUrl = link.attr("href");
            return await callOcr(pdfUrl, "pdf");
        } else if (pic.parent().filter("a").length > 0) {
            const picHref = pic.parent().attr("href");
            return callOcr(picHref, "image");
        } else if (pic.attr("src") !== undefined) {
            const picSrc = pic.attr("src");
            return await callOcr(picSrc, "encoded");
        } else {
            return parseMenu($("div.entry-content", "#post-2").text());
        }

        async function callOcr(picData: string, actionMetod: "pdf" | "image" | "encoded") {
            const url = "https://at11ocr.azurewebsites.net/api/process/" + actionMetod;
            const requestBody = `=${encodeURIComponent(picData)}`;
            const response = await axios.post(url, requestBody, {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                timeout: 25_000
            }).catch(() => ({ data: "" }));
            return parseMenu(response.data);
        }

        function parseMenu(menuString: string) {
            const lines = menuString.split("\n").filter((val) => val.trim());

            const texts: string[] = [];
            let price: number;
            for (let i = 0; i < lines.length; i++) {
                if (todayNameReg.test(lines[i])) {
                    for (let offset = 0; offset < 3; offset++) {
                        let txt = lines[i + offset];
                        if (offset === 0) {
                            txt = txt.replace(todayNameReg, "");
                        }
                        if (offset === 1) {
                            txt = txt.replace(dateReg, "");
                        }
                        txt = normalize(txt);
                        if (txt) {
                            texts.push(txt);
                        }
                    }
                }
                if (/Hodnota/.test(lines[i])) {
                    price = parsePrice(lines[i]).price;
                } else {
                    price = price || NaN;
                }
            }

            const dayMenu: IMenuItem[] = texts.map((text, index) => {
                return { isSoup: /polievka/i.test(text), text, price: index === 0 ? NaN : price };
            });
            return dayMenu;
        }

        function normalize(str: string): string {
            return str.tidyAfterOCR()
                .removeItemNumbering()
                .removeMetrics()
                .normalizeWhitespace();
        }
    }
}
