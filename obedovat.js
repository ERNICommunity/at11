var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var first;

        $('.daily-menu-for-day').each(function() {
            var menu = parseMenu(this);
            if (!first && menu.length > 0) {
                first = menu;
            }
        });

        return first;

        function parseMenu(elem) {
            return $(elem).find('li').map(function() {
                var text = $(this).text();
                return normalize(text);
            });
        }

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^\d\.\s*/, '');
        }
    };
})();