var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function () {
    this.parse = function (html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var todayStr = global.todaysDate.format("D.M.YYYY");

        $('.daily-menu-for-day').each(function () {
            if ($(this).children("header").first().text().indexOf(todayStr) !== -1) {
                menu = parseMenu($(this));
                //I think it is safe enough to assume that the first item in menu is the soup
                if (menu.length > 0) {
                    menu[0].isSoup = true;
                }
                return false;
            }
        });

        return menu;

        function parseMenu(elem) {
            var arr = new Array();

            var header = normalize(elem.find('header.rm').first().text());
            if (header && !endsWith(header, 'menu')) {
                arr.push({isSoup: false, text: header, price: NaN});
            }

            elem.find('li').each(function () {
                var text = normalize($(this).children(".name").first().text());
                var priceMatch = /(\d+[\.,]\d+) ?€/.exec($(this).children(".price").first().text().replace(",", "."));
                var price = priceMatch ? parseFloat(priceMatch[1]) : NaN;
                arr.push({isSoup: false, text: text, price: price});
            });
            return arr;
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function normalize(str) {
            return str.trim()
                .removeDoubleWhitespace()
                .removeItemNumbering()
                .removeMetrics();
        }
    };
})();
