var zomato = require('./zomato');

module.exports.parse = function(html, date, callback) {
  zomato.parse(html, function(menuItems) {
    for (var i = 0; i < menuItems.length; i++) {
      var menu = menuItems[i].menu;
      var price = NaN;
      for (var j = 0; j < menu.length; j++) {
        var item = menu[j];
        item.isSoup = !item.isSoup;
        if (item.isSoup) {
          price = item.price;
          item.price = NaN;
        } else {
          item.price = price;
        }
      }
    }
    callback(menuItems);
  });
};
