var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html, { decodeEntities: true });
    var dayMenu = [];

    var currentDay = $('div#privitanie>div').children().filter(function(index, item) { return $(item).text().indexOf(date.format("DD.MM.YYYY")) > -1; }).eq(0);
    if (currentDay) {
        var soupMenu = currentDay.next();
        var mainMenu = soupMenu.next();
        var soupItems = soupMenu.text().split(/\//g);
        var mainItems = mainMenu.text().split(/\d\.\s/g).filter(function(item) { return item.trim() !== ''; });

        dayMenu = soupItems.map(function(item, index) { return parseMenu(item, index, true); });
        dayMenu = dayMenu.concat(mainItems.map(function(item, index) { return parseMenu(item, index, false); }));
    }

    function parseMenu(item, index, isSoup) {
        if (item.trim() === '') {
            return;
        }

        var text = item.split(/\d+\,\d+/)[0];
        var tmp = { isSoup: false, text: normalize(text), price: NaN };
        if (isSoup) {
            tmp.isSoup = true;
        } else {
            var priceString = item.match(/\d+\,\d+/g)[0];
            tmp.price = parseFloat(priceString.replace(",", "."));
        }

        return tmp;
    }

    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
