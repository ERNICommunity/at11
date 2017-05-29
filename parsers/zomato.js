// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var parserUtil = require('./parserUtil');

module.exports.parse = function(response, callback) {
    var dayMenu = [];

    response = JSON.parse(response);

    if (response.status === 'success') {
        var dailyMenu = response.daily_menus[0];

        // read the menu if its available
        if (dailyMenu) {
            dayMenu = dailyMenu.daily_menu.dishes.map(function(menuItem) {
                return {
                    isSoup: false,
                    text: menuItem.dish.name,
                    price: parserUtil.parsePrice(menuItem.dish.price).price
                };
            });
        }
    }
    
    callback(dayMenu);
};
