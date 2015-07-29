var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    
    var weekMenu = [];
    var soupPattern = /^0[\.,]\d+\s?l/;

    var dnesneMenu = $('.jedlo_polozka', '.dnesne_menu');
    global.dates.forEach(function(date) {
        var dayMenu = [];
        if(dnesneMenu.length === 1) {
            dayMenu.push("Dnes nie je menu");
        }
        else {
            dnesneMenu.each(function() {
                if($(this).find('.left>b').length === 0)
                    dayMenu.push(this);
            });
        }
        //convert to menu item object
        dayMenu = dayMenu.map(function(item) {
            var label = $('.left', item).text();
            var price = $('.right', item).text();
            return { isSoup: soupPattern.test(label.trim()), text: normalize(label), price: parseFloat(price) };
        });

        weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
    });
    
    callback(weekMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .replace(soupPattern,'')
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
};
