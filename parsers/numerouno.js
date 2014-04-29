var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menuText = $('div.entry-content').first().text().trim().split(/\n/).map(function(line) {
            return line.replace(/\t/g, '');
        });

        var menu = parseDailyMenu(menuText);
        if (!menu || menu.length === 0)
            return menu;

        //the first menu entry is also a soup
        menu[0] = menu[0] == '' ? 'Dnes v menu chýba polievka' : menu[0];

        menu = menu.map(function(line) {
            //prize is written the other way around than usual e.g. € 5.10 instead of 5.10 €
            return line.replace(/€ ([0-9]{1,2},[0-9]{2})/, '$1 €');
        });

        //sometimes one menu item is scattered across multiple lines of HTML
        //lines with extra indentation should be merged with previous line
        for (var i = 0; i < menu.length; i++) {
            if (/^\s{4,}/.test(menu[i]))
            {
                menu[i - 1] = menu[i - 1] + " " + menu[i].trim();
                menu.splice(i, 1);
                i--;
            }
            else if (/^\s*menu č\. ?4/i.test(menu[i])) {
                if(i+1 < menu.length)//prepend it to the next item
                    menu[i+1] = menu[i].trim() + ": " + menu[i+1].trim();
                menu.splice(i, 1);
            }
            else
            {
                menu[i] = menu[i].trim();
            }
        }

        //convert to objects
        menu = menu.map(function(item, index){
            var priced = parserUtil.parsePrice(normalize(item));
            return {isSoup: index===0, text: priced.text, price: priced.price};
        });

        return menu;

        function parseDailyMenu(menuText) {
            var todayName = parserUtil.dayNameMap[global.todaysDate.getDay()];
            var tomorrowName = parserUtil.dayNameMap[global.todaysDate.getDay() + 1];

            var startLine, endLine;
            for (var line in menuText) {
                if (menuText[line].toLowerCase().indexOf(todayName) !== -1) {
                    startLine = line;
                }
                if (menuText[line].toLowerCase().indexOf(tomorrowName) !== -1) {
                    endLine = line;
                }
            }
            if (!startLine || (startLine >= endLine)) {
                return [];
            }

            var menuResult = menuText.slice(startLine, endLine);
            menuResult = menuResult.filter(function(line){ return /\S/.test(line)});//remove empty lines
            //remove name of the day from the first menu entry
            menuResult[0] = menuResult[0].substring(todayName.length).trim();
            return menuResult;
        }

        function normalize(str) {
            return str.trim()
                .replace(/\s\s+/g, ' ')
                .replace(/^\d\.\s*/, '');
        }
    };
})();

