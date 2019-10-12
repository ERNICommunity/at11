var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];

    var soupPattern = /0[.,]\d+\s?l?$/;
    var dayOfWeek = parseInt(date.format('e')) + 1;

    var elements = $('.obedove-nadpis', '#content');
    var price = NaN;
    elements.eq(0).text().replace(/\d,\d{2}\s€/, function(match){
        price = parseFloat(match.replace(',', '.'));
    });

    elements.eq(dayOfWeek).next().find('td').text()
    .split('\n').filter(function(item){ return item; })
    .forEach(function(item) {
        dayMenu.push(item);
    });

    //convert to menu item object
    dayMenu = dayMenu.map(function(item) {
        var menuItem = { isSoup: soupPattern.test(item.trim()) };
        if(menuItem.isSoup){
            menuItem.text = normalize(item.replace(soupPattern, ''));
            menuItem.price = NaN;
        }
        else
        {
            menuItem.text = normalize(item);
            menuItem.price = price;
        }
        return menuItem;
    });

    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
  };
