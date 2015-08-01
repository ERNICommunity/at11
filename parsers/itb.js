var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function (html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];
    var menuRows = [];

    global.dates.forEach(function (date) {
        var todayNameRegex = new RegExp(date.format("dddd"), "i");
        var tomorrowNameRegex = new RegExp(date.clone().add(1, 'days').format('dddd'), "i");

        menuRows = $('.tabularmenu').children('div.one-third, div.one-third-last, h2');

        var foundCurrentDay = false;
        var dayMenu = [];

        menuRows.each(function (index, element) {
            var $row = $(element);
            var text = $($row[0]).text();
            if (tomorrowNameRegex.test(text) || (foundCurrentDay) && (/II\./.test(text) || $row.children().eq(0).text().trim() === '')) {
                return false;
            }
            if (foundCurrentDay) {
                var meal = parseMeal($row);
                if (!isNaN(meal.price)) {
                    dayMenu.push(parseMeal($row));
                }
            }
            if (todayNameRegex.test(text)) {
                foundCurrentDay = true;
            }
        });
        
        dayMenu.sort(function (item) {
            if (item.isSoup) {
                return 0;
            } else {
                return 1;
            }
        });

        weekMenu.push({ day: date.format("dddd"), menu: dayMenu });
    });

    callback(weekMenu);
    
    function parseMeal(tablerow) {
        var menuItem = {};
        menuItem.isSoup = /polievka/i.test(tablerow.children('h3').text());
        var textParts = tablerow.find('li').children('span').eq(1)[0].children;
        menuItem.text = normalize($(textParts[0]).text() + "," + $(textParts[2]).text());
        menuItem.price = parseFloat(tablerow.find('li').children('span').eq(0).text().replace(/,/, '.'));
        
        return menuItem;
    }
    
    function removeTrailingAlergens(str) {
        return str.trim().replace(/,?\s*alerg.*/i, '').trim();
    }
    
    function normalize(str) {
        return removeTrailingAlergens(str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing()
            .toLowerCase()
            .capitalizeFirstLetter());
    }
};
