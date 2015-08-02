var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];

    var todayNameRegex = new RegExp(date.format("dddd"), "i");
    var tomorrowNameRegex = new RegExp(date.clone().add(1, 'days').format('dddd'), "i");

    var menuRows = $('.tabularmenu').children('div.one-third, div.one-third-last, h2');
    var foundCurrentDay = false;
    menuRows.each(function(index, element) {
        var $row = $(element);
        var text = $row.eq(0).text();
        if (tomorrowNameRegex.test(text)) {
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

    dayMenu.sort(function(item) {
        if (item.isSoup) {
            return 0;
        } else {
            return 1;
        }
    });
    callback(dayMenu);

    function parseMeal(tablerow) {
        var menuItem = {};
        if (tablerow.find('li').length === 0) {
            return menuItem;
        }
        menuItem.isSoup = /polievka/i.test(tablerow.children('h3').text());
        var textParts = tablerow.find('li').children('span').eq(1)[0].children;
        var mergedText = textParts.length > 1 ? $(textParts[0]).text() + "," + $(textParts[2]).text() : $(textParts[0]).text();
        menuItem.text = normalize(mergedText);
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
