
var cheerio = require('cheerio');

module.exports = new (function () {
    this.parse = function (html, doneCallback) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var todayStr = global.todaysDate.getDate() + "." + (global.todaysDate.getMonth() + 1) + "." + global.todaysDate.getFullYear();

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

        doneCallback(menu);

        function parseMenu(elem) {
            var arr = new Array();

            var header = normalize(elem.find('header.rm').first().text());
            if (header && !endsWith(header, 'menu')) {
                arr.push(header);
            }

            elem.find('li').each(function () {
                arr.push({isSoup: false, text: normalize($(this).text())});
            });
            return arr;
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function normalize(str) {
            return str.trim()
                .replace(/\s\s+/g, ' ')
                .replace(/^\d\s*\.\s*\)*\s*/, '');
        }
    };
})();
