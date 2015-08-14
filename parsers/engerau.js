var zomato = require('./zomato');

module.exports.parse = function(html, date, callback) {
    zomato.parse(html, date, function(menuItems) {
        var price = NaN;
        var dayMenu = menuItems.map(function(item){
            if (item.isSoup) {
              price = item.price;
              item.price = NaN;
            } else {
              item.price = price;
            }
            return item;
        });
        callback(dayMenu);
    });
};
