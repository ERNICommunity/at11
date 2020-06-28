import { IMenuItem } from "./IMenuItem";

declare global {
    interface String {
        tidyAfterOCR: () => string;
        normalizeWhitespace: () => string
        removeMetrics: () => string;
        removeAlergens: () => string;
        capitalizeFirstLetter: () => string;
        removeItemNumbering: () => string;
    }
}

export function parsePrice(item: string): { price: number, text: string} {
    const priceRegex = /(\d+(?:[.,]\d+)?)[.,]?\s*(?:€|Eur)/ig;
    let price = NaN;
    const text = item.replace(priceRegex, (matchStr, group1) => {
        price = parseFloat(group1.replace(/\s/g, "").replace(",", "."));
        return "";
    });
    return {
        price,
        text: text.trim()
    };
}

export function getDateRegex(date: Date): RegExp {
   return new RegExp(`0?${date.getDate()}\\.\\s?0?${date.getMonth() + 1}\\.\\s?${date.getFullYear()}`);
}

const accentPairs: {[key: string]: string} = { a: "á", e: "é", i: "í", o: "ó", u: "ú", y: "ý", t: "ť", l: "ľ" };

String.prototype.tidyAfterOCR = function(): string {
    return this.replace(/(\w)[`']/g, (m: string, g: string) => {
        return accentPairs[g] || m;
    }).replace("%:", "€");
};

String.prototype.normalizeWhitespace = function() {
    // also single spaces are replaced as there are different charcodes for space (32 vs. 160)
    // and we need to be consistent because of comparisons in tests
    return this.trim().replace(/\s+/g, " ");
};

String.prototype.removeMetrics = function() {
    return this.replace(/\s*\(?(?:\d+\/)?( ?\d[\doO\s]*)+ *(?:[,.]\d[\doO]*)? *[lLgG]\)?\.?\s*/g, " ").trim();
};

String.prototype.removeAlergens = function() {
    return this.replace(/\s*[\s(\d,)]+$/g, "");
};

String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/(^[A-Za-z\u00C0-\u017F])/, (a: string) => a.toUpperCase());
};

String.prototype.removeItemNumbering = function() {
    return this.trim().replace(/^\W\s+/, "").replace(/^[\dA-Z][ ).,:;]+(?:[AB]\s+)?/, "").trim();
};

// Soup first menu item comparere
export function compareMenuItems(first: IMenuItem, second: IMenuItem): number {
    const f = first.isSoup ? 0 : 1;
    const s = second.isSoup ? 0 : 1;
    return f - s;
}
