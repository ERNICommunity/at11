module.exports.parsePrice = function(item) {
    var priceRegex = /([\d,.,,]*[\s]*)(€|Eur)/;
    var price = NaN;
    var text = item.replace(priceRegex, function(matchStr, group1, offset, originalStr){
        price = parseFloat(group1.replace(/\s/g, "").replace(",", "."));
        return "";
    });
    return {
        price: price,
        text: text
    };
};

global.String.prototype.removeDoubleWhitespace = function() {
    return this.replace(/\s\s+/g, ' ');
};

global.String.prototype.correctCommaSpacing = function() {
    return this.replace(/(\S)(,|\.)(\S)/g, '\$1\$2 \$3');
};

global.String.prototype.removeMetrics = function() {
    return this.replace(/(\d*\/)*\d+ *,?\d+ *[lg].? */g, '');
};

global.String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/(^[A-Za-z\u00C0-\u017F])/, function(a) { return a.toUpperCase(); })
};

global.String.prototype.removeItemNumbering = function() {
    return this.replace(/^[\w,\d][\),\.]\s*/m, '');
};
