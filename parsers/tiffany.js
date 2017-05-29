require('./parserUtil');
var zomato = require('./zomato');

// date arg remains even if its not necessary ("method should have 3 parameters" check in app.js)
module.exports.parse = function(response, date, callback) {
    zomato.parse(response, function(menu) {
        callback(menu.map(function(menuItem) {
            return {
                isSoup: /Polievk/.test(menuItem.text),
                text: normalize(menuItem.text),
                price: menuItem.price
            };
        }));
    });

    function normalize(str) {
        return str.removeItemNumbering()
            .normalizeWhitespace();
    }
};
