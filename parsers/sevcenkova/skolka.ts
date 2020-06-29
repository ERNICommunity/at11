import cheerio from "cheerio";

import { IMenuItem } from "../IMenuItem";
import { IParser } from "../IParser";
import { getDateRegex, parsePrice } from "../parserUtil";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { OcrService } from "../../services/ocr.service";

export class Skolka implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        const $ = cheerio.load(html);

        const pic = $(".entry-content img");
        const link = $(".entry-content a").filter((index, el) => $(el).text() !== "" && !/<a/.test($(el).html()));

        if (pic.length === 0 && link.length > 0) {
            const pdfUrl = link.attr("href");
            const ocrData = await OcrService.scanData(pdfUrl, "pdf");
            return this.parseMenu(date, ocrData);
        } else if (pic.parent().filter("a").length > 0) {
            const picHref = pic.parent().attr("href");
            const ocrData = await OcrService.scanData(picHref, "image");
            return this.parseMenu(date, ocrData);
        } else if (pic.attr("src") !== undefined) {
            const picSrc = pic.attr("src");
            const ocrData = await OcrService.scanData(picSrc, "encoded");
            return this.parseMenu(date, ocrData);
        } else {
            return this.parseMenu(date, $("div.entry-content", "#post-2").text());
        }
    }

    private parseMenu(date: Date, menuString: string): IMenuItem[] {
        const lines = menuString.split("\n").filter((val) => val.trim());

        const dateReg = getDateRegex(date);
        const todayNameReg = new RegExp(`^\\s*${format(date, "EEEE", { locale: sk })}`, "i");

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
                    txt = this.normalize(txt);
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

        const dayMenu: IMenuItem[] = texts.map((text, index) => ({
            isSoup: /polievka/i.test(text),
            text,
            price: index === 0 ? NaN : price
        }));
        return dayMenu;
    }

    normalize(str: string): string {
        return str.tidyAfterOCR()
            .removeItemNumbering()
            .removeMetrics()
            .normalizeWhitespace();
    }
}
