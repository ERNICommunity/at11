
module.exports.parsePrice = function(item) {
    var priceRegex = /(\d+(?:[.,]\d+)?)[.,]?\s*(?:€|Eur)/i;
    var price = NaN;
    var text = item.replace(priceRegex, function(matchStr, group1) {
        price = parseFloat(group1.replace(/\s/g, "").replace(",", "."));
        return "";
    });
    return {
        price: price,
        text: text
    };
};

var accentPairs = { 'a': "á", 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú', 'y': 'ý', 't': 'ť', 'l': 'ľ' };

global.String.prototype.tidyAfterOCR = global.String.prototype.tidyAfterOCR || function() {
    return this.replace(/(\w)[`']/g, function(m, g) {
        return accentPairs[g] || m;
    }).replace('%:', '€');
};

global.String.prototype.normalizeWhitespace = global.String.prototype.normalizeWhitespace || function() {
    // also single spaces are replaced as there are different charcodes for space (32 vs. 160)
    // and we need to be consistent because of comparisons in tests
    return this.trim().replace(/\s+/g, ' ');
};

global.String.prototype.correctCommaSpacing = global.String.prototype.correctCommaSpacing || function() {
    return this.replace(/(\S) *(,|\.) *(\S)/g, '$1$2 $3');
};

global.String.prototype.removeMetrics = global.String.prototype.removeMetrics || function() {
    //after metrics removal there might be whitespaces left at the ends so trim it afterwards
    return this.replace(/\s*\(?(?:\d+\/)?( ?\d[\doO\s]*)+ *(?:[,.]\d[\doO]*)? *[lLgG]\)?\.?\s*/g, ' ').trim();
};

global.String.prototype.capitalizeFirstLetter = global.String.prototype.capitalizeFirstLetter || function() {
    return this.replace(/(^[A-Za-z\u00C0-\u017F])/, function(a) { return a.toUpperCase(); });
};

global.String.prototype.removeItemNumbering = global.String.prototype.removeItemNumbering || function() {
    return this.trim().replace(/^\W\s+/, '').replace(/^[\w\d] *[).,]+[AB]?\s*/, '').trim();
};

// Soup first menu item comparere
module.exports.compareMenuItems = function(first, second)
{
    var f = first.isSoup ? 0 : 1;
    var s = second.isSoup ? 0 : 1;
    return f - s;
};
