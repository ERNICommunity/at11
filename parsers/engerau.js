require('./parserUtil');
var zomato = require('./zomato');

// date arg remains even if its not necessary ("method should have 3 parameters" check in app.js)
module.exports.parse = function(response, date, callback) {
    zomato.parse(response, function(menu) {
        var foundMainCourse = false;
        
        callback(menu.reduce(function(agg, menuItem) {
            foundMainCourse = foundMainCourse || /^\d\s?[\.,]\){0,1}/.test(menuItem.text);
            if (!/extra\s{0,1}menu/i.test(menuItem.text)) {
                agg.push({
                    isSoup: !foundMainCourse,
                    text: normalize(menuItem.text),
                    price: menuItem.price
                });
            }
            return agg;
        }, []));
    });

    function normalize(str) {
        return str.removeItemNumbering()
            .removeMetrics()
            .replace(/A\s(\d\s?[\.,]?\s?)+$/, '')
            .correctCommaSpacing()
            .normalizeWhitespace();
    }
};
