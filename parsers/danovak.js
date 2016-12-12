var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html, { decodeEntities: false });
    var dayMenu = [];

    var currentDay = $('div#privitanie>div').children().filter(function(index, item) { return $(item).text().indexOf(date.format("DD.MM.YYYY")) > -1; }).eq(0);
    if (currentDay) {
        var menu = currentDay.next();
        var items = menu.text().split(/\d\.\s/g);

        dayMenu = items.map(function(item, index) {
            var text = item.split(/\d*\.\d*/)[0];
            var tmp = { isSoup: false, text: normalize(text), price: NaN };
            if (index === 0) {//I think it is safe enough to assume that the first item in menu is the soup
                tmp.isSoup = true;
            } else {
                tmp.price = parseFloat(item.match(/\d*\.\d*/g)[0]);
            }
            return tmp;
        });
    }

    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
