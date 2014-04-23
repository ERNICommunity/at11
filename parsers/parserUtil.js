module.exports.removeMetrics = function(item) {
    return item.replace(/([0-9]+ *\/?)+[gl]\.? ?/g, "").replace(/^(,* *)/g, "");
};

module.exports.parsePrice = function(item) {
    var match = item.match(/ ?[0-9]{1,2}(?:[,.] *[0-9]{1,2})? *€/g);
    if (match && match.length > 0) {

        var withoutPrice = item;
        for (var p in match) {
            withoutPrice = withoutPrice.replace(match[p], "");
        }

        var price = normalizePriceArray(match).join("/");

        return {
            price: price,
            menuItemWithoutPrice: withoutPrice
        };
    } else {
        return {
            price: "",
            menuItemWithoutPrice: item
        };
    }

    function normalizePriceArray(prices) {
        for (var p in prices) {
            prices[p] = prices[p].trim().replace(/ *€/g," €");
        }
        return prices;
    }
};

module.exports.dayNameMap = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];