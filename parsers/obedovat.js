var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        $('.daily-menu-for-day').each(function() {
            var now = new Date();
            var todayStr = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
            if (this.children("header").first().text().indexOf(todayStr) !== -1) {
                menu = parseMenu(this);
                //I think it is safe enough to assume that the first item in menu is the soup
                if (menu.length > 0) {
                    menu[0] = "<div class=\"soup\">" + menu[0] + "</div>";
                }
                return false;
            }
        });

        return menu;

        function parseMenu(elem) {
            var arr = new Array();

            var header = normalize(elem.find('header.rm').first().text());
            if (header && !endsWith(header, 'menu')) {
                arr.push(header);
            }

            elem.find('li').each(function() {
                arr.push(normalize(this.text()));
            });
            return arr;
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function normalize(str) {
            return str.trim()
                .replace(/\s\s+/g, ' ')
                .replace(/^\d\.\s*/, '');
        }
    };
})();
