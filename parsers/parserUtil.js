module.exports.removeMetrics = function(item) {
    return item.replace(/\d+ *,?\d+ *[lg].? */g, "");
};

module.exports.parsePrice = function(item) {
    var priceRegex = /(\d{1,2}(?:[,\.] *\d{1,2})?) *€/;
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

module.exports.dayNameMap = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];