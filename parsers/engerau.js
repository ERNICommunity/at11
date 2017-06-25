var zomato = require("./zomato");

module.exports.parse = function(html, date, callback) {
    zomato.parse(html, date, function(menuItems) {
        var price = NaN;
        var lastElems = menuItems.splice(-3); // last 3 items are parsed wrongly by zomato parser, need to be fixed manually
        var dayMenu = menuItems.map(function(item) {
            if (item.isSoup) {
                price = item.price;
                item.price = NaN;
            } else {
                item.price = price;
            }
            item.text = normalize(item.text);
            return item;
        });
        // fix last item
        dayMenu.push(lastElems[1]);
        dayMenu[dayMenu.length - 1].isSoup = false;
        dayMenu[dayMenu.length - 1].text = normalize(dayMenu[dayMenu.length - 1].text);
        callback(dayMenu);
    });

    function normalize(str) {
        return str.replace(/\*.*$/, "");
    }
};
