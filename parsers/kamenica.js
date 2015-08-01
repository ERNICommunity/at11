var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);

    var soupPattern = /0[\.,]\d+\s?l?$/;

    var dayOfWeek = parseInt(date.format('e')) + 1;
    var dnesneMenu = $('.obedove-nadpis', '#content').eq(dayOfWeek).next().find('td').text().split('\n').filter(function(item){ return item; });
    var dayMenu = [];
    dnesneMenu.forEach(function(item) {
        dayMenu.push(item);
    });

    //convert to menu item object
    dayMenu = dayMenu.map(function(item) {
        return { isSoup: soupPattern.test(item.trim()), text: normalize(item), price: NaN };
    });
    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .replace(soupPattern, '')
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
  };
