var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var menu = [];
    var todayStr = global.todaysDate.format("D.M.YYYY");

    $('.daily-menu-for-day').each(function() {
        if ($(this).children("header").first().text().indexOf(todayStr) !== -1)
        {
            menu = parseMenu($(this));
            //I think it is safe enough to assume that the first item in menu is the soup
            //for Ergenau on weekends, the first item is "Vikendove menu"
            if (menu.length === 0) return false;
            if (/menu/.test(menu[0].text))
            {
                if (menu.length > 1)
                {
                    menu[1].isSoup = true;
                    menu[1].price = menu[0].price;
                }
                menu.splice(0, 1);
            }
            else
            { menu[0].isSoup = true; }
        }
    });

    callback(menu);

    function parseMenu(elem) {
        var arr = [];

        var header = normalize(elem.find('header.rm').first().text());
        if (header && !endsWith(header, 'menu'))
        {
            arr.push({ isSoup: false, text: header, price: NaN });
        }

        elem.find('li').each(function() {
            var text = normalize($(this).children(".name").first().text());
            var priceMatch = /(\d+[\.,]\d+) ?€/.exec($(this).children(".price").first().text().replace(",", "."));
            var price = priceMatch ? parseFloat(priceMatch[1]) : NaN;
            arr.push({ isSoup: false, text: text, price: price });
        });
        return arr;
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
