var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function() {
    this.parse = function(html, doneCallback) {

        var $ = cheerio.load(html);

        var menuText = $('.entry-content div').first().text().trim().match(/[^\r\n]+/g).map(function(line) {
            return line.replace(/\t/g, '');
        });

        var menu = parseDailyMenu(menuText);
        if (!menu || menu.length === 0){
            doneCallback([]);
            return;
        }

        //the first menu entry is also a soup
        menu[0] = menu[0] == '' ? 'Dnes v menu chýba polievka' : menu[0];

        menu = menu.map(function(line) {
            //prize is written the other way around than usual e.g. € 5.10 instead of 5.10 €
            line = line.replace(/€ ([0-9]{1,2},[0-9]{2})/, '$1 €');
            //remove leading numbering
            return line.replace(/^[1-3]\. (.*)/, '$1');
        });

        //sometimes one menu item is scattered across multiple lines of HTML
        //lines with extra indentation should be merged with previous line
        for (var i in menu) {
            if (startsWith(menu[i], "    ")) {
                menu[i - 1] = menu[i - 1] + " " + menu[i].trim();
                menu.splice(i, 1);
                i = i - 1;
            } else {
                menu[i] = menu[i].trim();
            }
        }

        //remove unnecessary menu items
        for (var item in menu) {
            if (startsWith(menu[item], "menu č.4")) {
                menu = menu.slice(0, item);
                break;
            }
        }

        //convert to objects
        menu = menu.map(function(item, index){
            return {isSoup: index===0, text: item};
        });

        doneCallback(menu);

        function parseDailyMenu(menuText) {
            var todayName = parserUtil.dayNameMap[global.todaysDate.getDay()];
            var tomorrowName = parserUtil.dayNameMap[global.todaysDate.getDay() + 1];

            var startLine, endLine;
            for (var line in menuText) {
                if (menuText[line].toLowerCase().indexOf(todayName) !== -1) {
                    startLine = line;
                    endLine = undefined;
                }
                if (tomorrowName && menuText[line].toLowerCase().indexOf(tomorrowName) !== -1) {
                    endLine = line;
                }
                if (!endLine && menuText[line].trim() === "") {
                    endLine = line;
                }
            }
            if (!startLine) {
                return [];
            }

            var menuResult = menuText.slice(startLine, endLine);
            //remove name of the day from the first menu entry
            menuResult[0] = menuResult[0].substring(todayName.length).trim();
            return menuResult;
        }

        function startsWith(str, substring) {
            return str.slice(0, substring.length) == substring;
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function normalize(str) {
            return str.trim()
                .replace(/\s\s+/g, ' ')
                .replace(/^\d\.\s*/, '');
        }
    };
})();

