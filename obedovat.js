var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        $('.daily-menu-for-day').each(function() {
            var now = new Date();
            var todayStr = now.getDate() + "." + now.getMonth() + "." + now.getFullYear();
            if(this.children("header").first().text().indexOf(todayStr) !== -1)
            {
                menu = parseMenu(this);
            }
        });

        return menu;

        function parseMenu(elem) {
            var arr = new Array();
            $(elem).find('li').map(function() {
                var text = $(this).text();
                arr.push(normalize(text));
            });
            return arr;
        }

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^\d\.\s*/, '');
        }
    };
})();