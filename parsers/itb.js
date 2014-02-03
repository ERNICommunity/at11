var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        
        $('td.cnt', '#contentBox').children('table').each(function(index) {
            if(index === new Date().getDay() - 1)
            {
                menu = parseMenu(this, this.prev());
                return false;
            }
        });

        return menu;

        function parseMenu(table, p) {
            var temp = [];
            table.find('tr').each(function() {
                temp.push(normalize(this.text().replace(/.\)/, '')));
            });
            var m = /Polievk.*:(.+)Špec.*:(.+)delená.*:(.+)$/ig.exec(p.text());
            temp.unshift(normalize(m[3]));
            temp.unshift(normalize(m[2]));
            temp.unshift(normalize(m[1]));
            return temp;
        }

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^\d\.\s*/, '');
        }
    };
})();