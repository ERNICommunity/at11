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
                temp.push({isSoup: false, text: normalize($(this).text())});
            });
            
            var mixedText = "";
            table.prevUntil('table').each(function() {
                mixedText = $(this).text() + mixedText;
            });
            var m = /Polievk.*:(.+)Špec.*:(.+)delená.*:(.+)$/i.exec(mixedText);
            for (var i = m.length - 1; i > 0; i--) {
                temp.unshift({isSoup: false, text: normalize(m[i])});
            }
            if(m.length === 4)//if all groups were matched first must be soup
                temp[0].isSoup = true;
            
            return temp;
        }

        function normalize(str) {
            return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\s*[A-Z]\)\s*/, '')
				.toLowerCase();
        }
    };
})();