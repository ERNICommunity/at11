var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var todayNameRegex = new RegExp("^\\s*" + parserUtil.dayNameMap[global.todaysDate.getDay()], "i");

        $('td.cnt', '#contentBox').children('table').each(function() {
            var precedingText = "";
            $(this).prevUntil('table').each(function() {
                precedingText = $(this).text() + precedingText;
            });
            if (todayNameRegex.test(precedingText)) {
                menu = parseMenu($(this), precedingText);
                return false;
            }
        });

        return menu;

        function parseMenu(table, mixedText) {
            var temp = [];
            table.find('tr').each(function() {
                temp.push({isSoup: false, text: normalize($(this).text())});
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