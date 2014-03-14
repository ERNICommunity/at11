var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var soupPattern = new RegExp("[0-9,]+l$");

        $('.jedlo_polozka', '.dnesne_menu').each(function() {
			if(this.find('b').length === 0)
				menu.push(normalize(this.text()));
        });

        for (menuLine in menu){
            if (soupPattern.test(menu[menuLine])){
                 menu[menuLine] = "<div class=\"soup\">" + menu[menuLine] + "</div>";
            }
        }

        return menu;

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^[A-C]\.\s*/, '');
        }
    };
})();