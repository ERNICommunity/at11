var cheerio = require('cheerio');

module.exports = new (function () {
    this.parse = function (html, doneCallback) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var soupPattern = new RegExp("[0-9,]+l$");

        $('.jedlo_polozka', '.dnesne_menu').each(function () {
            if ($(this).find('b').length === 0)
                menu.push(normalize($(this).text()));
        });

        //convert to menu item object
        menu = menu.map(function(item){
            return {isSoup: soupPattern.test(item), text: item};
        });

        doneCallback(menu);

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^[A-C]\.\s*/, '');
        }
    };
})();