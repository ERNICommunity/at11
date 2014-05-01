var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var soupPattern = new RegExp("[0-9,]+l$");

        var dnesneMenu = $('.jedlo_polozka', '.dnesne_menu');
        if (dnesneMenu.length == 1)
        {
            menu.push("Dnes nie je menu");
        }
        else
        {
            dnesneMenu.each(function() {
                if ($(this).find('b').length === 0)
                    menu.push(normalize($(this).text()));
            });
        }
        //convert to menu item object
        menu = menu.map(function(item) {
            return { isSoup: soupPattern.test(item), text: item, price: NaN };
        });

        return menu;

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^[A-C]\.\s*/, '');
        }
    };
})();