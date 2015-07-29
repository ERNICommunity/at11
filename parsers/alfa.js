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
            var left = $('.left', item).text();
            var right = $('.right', item).text();
            return { isSoup: soupPattern.test(left.trim()), text: normalize(left), price: parseFloat(right) };
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
