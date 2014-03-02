var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        $('.jedlo_polozka', '.dnesne_menu').each(function() {
			if(this.find('b').length === 0)
				menu.push(normalize(this.text()));
        });

        return menu;

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^[A-C]\.\s*/, '');
        }
    };
})();