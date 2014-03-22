module.exports.removeMetrics = function(item){
    return item.replace(/([0-9,]+ *\/?)+[gl]\.? ?/g,"");
};

module.exports.parsePrice = function(item){
    var match = item.match(/[0-9]{1,2}(?:[,.] *[0-9]{1,2})? *€/);
    if (match.length>0){
        var price = match[0];
        var withoutPrice = item.replace(price,"");
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

};