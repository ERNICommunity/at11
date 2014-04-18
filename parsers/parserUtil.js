module.exports.removeMetrics = function(item){
    return item.replace(/([0-9,]+ *\/?)+[gl]\.? ?/g,"");
};

module.exports.parsePrice = function(item){
    var match = item.match(/ ?[0-9]{1,2}(?:[,.] *[0-9]{1,2})? *€/g);
    if (match && match.length>0){

        var withoutPrice = item;
        for (var p in match) {
            withoutPrice = withoutPrice.replace(match[p], "");
        }

        var price = normalizePriceArray(match).join("/");

        return {
            price: price,
            menuItemWithoutPrice: withoutPrice,
            menuItem: item
        }
    }else{
        return {
            price: "",
            menuItemWithoutPrice: item,
            menuItem: item
        }
    }

    function normalizePriceArray(prices){
        for (var p in prices){
            prices[p] = prices[p].trim();
        }
        return prices;
    }

};