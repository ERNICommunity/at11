import { IMenuItem } from "./IMenuItem";

declare global {
    // tslint:disable-next-line: interface-name
    interface String {
        tidyAfterOCR: () => string;
        normalizeWhitespace: () => string;
        correctCommaSpacing: () => string;
        removeMetrics: () => string;
        capitalizeFirstLetter: () => string;
        removeItemNumbering: () => string;
    }
}

export function parsePrice(item: string) {
    const priceRegex = /(\d+(?:[.,]\d+)?)[.,]?\s*(?:€|Eur)/i;
    let price = NaN;
    const text = item.replace(priceRegex, (matchStr, group1) => {
        price = parseFloat(group1.replace(/\s/g, "").replace(",", "."));
        return "";
    });
    return {
        price,
        text
    };
}

const accentPairs: {[key: string]: string} = { a: "á", e: "é", i: "í", o: "ó", u: "ú", y: "ý", t: "ť", l: "ľ" };

String.prototype.tidyAfterOCR = function(): string {
    return this.replace(/(\w)[`']/g, (m, g) => {
        return accentPairs[g] || m;
    }).replace("%:", "€");
};

String.prototype.normalizeWhitespace = function() {
    // also single spaces are replaced as there are different charcodes for space (32 vs. 160)
    // and we need to be consistent because of comparisons in tests
    return this.trim().replace(/\s+/g, " ");
};

String.prototype.correctCommaSpacing = function() {
    return this.replace(/(\S) *(,|\.) *(\S)/g, "$1$2 $3");
};

String.prototype.removeMetrics = function() {
    // after metrics removal there might be whitespaces left at the ends so trim it afterwards
    return this.replace(/\s*\(?(?:\d+\/)?( ?\d[\doO\s]*)+ *(?:[,.]\d[\doO]*)? *[lLgG]\)?\.?\s*/g, " ").trim();
};

String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/(^[A-Za-z\u00C0-\u017F])/, (a) => a.toUpperCase());
};

String.prototype.removeItemNumbering = function() {
    return this.trim().replace(/^\W\s+/, "").replace(/^[\w\d] *[).,]+[AB]?\s*/, "").trim();
};

// Soup first menu item comparere
export function compareMenuItems(first: IMenuItem, second: IMenuItem) {
    const f = first.isSoup ? 0 : 1;
    const s = second.isSoup ? 0 : 1;
    return f - s;
}
