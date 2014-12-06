var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function (html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];
    var menuRows = [];

    global.dates.forEach(function (date) {
        var todayNameRegex = new RegExp("^\\s*" + date.format("dddd"), "i");
        var tomorrowNameRegex = new RegExp("^\\s*" + date.clone().add(1, 'days').format('dddd'), "i");

        //get all menu rows in an array
        menuRows = $('td.cnt', '#contentBox').children('table').children('tbody').children().map(function () { return $(this); });

        var foundCurrentDay = false;
        var dayMenu = [];

        menuRows.each(function (index, element) {
            var $row = $(element);
            if (tomorrowNameRegex.test($row.children().eq(0).text()) || /II\./.test($row.children().eq(0).text()) || $row.children().eq(0).text().trim() === '') {
                return false;
            }
            if (foundCurrentDay) {
                dayMenu.push(parseMenuRow($row));
            }
            if (todayNameRegex.test($row.children().eq(0).text())) {
                foundCurrentDay = true;
            }
        });

        weekMenu.push({ day: date.format("dddd"), menu: dayMenu });
    });
    callback(weekMenu);

    function parseMenuRow(tablerow) {
        var menuItem = {};
        menuItem.isSoup = /polievka/.test(tablerow.children('td').eq(0).text());
        menuItem.text = normalize(tablerow.children('td').eq(2).text());
        menuItem.price = parseFloat(tablerow.children('td').eq(3).text().replace(/,/, '.'));

        return menuItem;
    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing()
            .toLowerCase()
            .capitalizeFirstLetter();
    }
};
