var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var today;
        
        $('td.cnt', '#contentBox').children('table').each(function(index, element) {
            if (!today && index === new Date().getDay() - 1)
            {
                today = parseMenu(element, $(element).prev());
                return false; //break loop
            }
        });

        return today;

        function parseMenu(table, p) {
            var temp = [];
            $(table).find('tr').map(function() {
                var text = $(this).text();
                temp.push(normalize(text.replace(/.\)/, '')));
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