var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        $('td.cnt', '#contentBox').children('table').each(function(index) {
            if (index === global.todaysDate.getDay() - 1) {
                menu = parseMenu($(this));
                return false;
            }
        });

        return menu;

        function parseMenu(table) {
            var temp = [];
            table.find('tr').each(function() {
                temp.push(normalize($(this).text().replace(/\w\)/, '')));
            });
            temp = temp.filter(function(x) { return x != ""; });
            var txt = "";
            table.prevUntil('table').each(function() {
                txt = $(this).text() + txt;
            });

            //format the soup
            txt = txt.replace(/Polievk.*:(.+)Špec.*:(.+)delená.*:(.+)$/ig, 'Polievk.*:<div class="soup">$1</div>Špec.*:$2delená.*:$3')

            var m = /Polievk.*:(.+)Špec.*:(.+)delená.*:(.+)$/ig.exec(txt);
            for (var i = m.length - 1; i > 0; i--) {
                temp.unshift(normalize(m[i]));
            }
            return temp;
        }

        function normalize(str) {
            return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '')
				.toLowerCase();
        }
    };
})();