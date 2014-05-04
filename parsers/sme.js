var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function() {
    this.parse = function(html, callback) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var soupPattern = new RegExp("[0-9,]+l?$");

        var dnesneMenu = $('.jedlo_polozka', '.dnesne_menu');
        if (dnesneMenu.length == 1)
        {
            menu.push("Dnes nie je menu");
        }
        else
        {
            dnesneMenu.each(function() {
                if ($(this).find('b').length === 0)
                    menu.push($(this).text());
            });
        }
        //convert to menu item object
        menu = menu.map(function(item) {
            return { isSoup: soupPattern.test(item.trim()), text: normalize(item), price: NaN };
        });

        callback(menu);

        function normalize(str) {
            return str.normalizeWhitespace()
                .replace(soupPattern,'')
                .removeMetrics()
                .correctCommaSpacing()
                .removeItemNumbering();
        }
    };
})();