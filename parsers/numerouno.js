var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var menuText = $('div.entry-content').first().text().trim().split(/\n/).map(function(line) {
        return line.replace(/\t/g, '');
    });

    var weekMenu = [];

    global.dates.forEach(function(date) {
        var dayMenu = parseDailyMenu(menuText, date);
        if (!dayMenu || dayMenu.length === 0) {
            callback(dayMenu);
            return;
        }

        //the first menu entry is also a soup
        dayMenu[0] = dayMenu[0] === '' ? 'Dnes v menu chýba polievka' : dayMenu[0];

        dayMenu = dayMenu.map(function(line) {
            //prize is written the other way around than usual e.g. € 5.10 instead of 5.10 €
            return line.replace(/€ ([0-9]{1,2},[0-9]{2})/, '$1 €');
        });

        //sometimes one menu item is scattered across multiple lines of HTML
        //lines with extra indentation should be merged with previous line
        for (var i = 0; i < dayMenu.length; i++) {
            if (/^\s{4,}/.test(dayMenu[i])) {
                dayMenu[i - 1] = dayMenu[i - 1] + " " + dayMenu[i].trim();
                dayMenu.splice(i, 1);
                i--;
            }
            else if (/\s*menu č\. ?4/i.test(dayMenu[i])) {
                if (i + 1 < dayMenu.length) //prepend it to the next item
                    dayMenu[i + 1] = dayMenu[i].trim() + ": " + dayMenu[i + 1].trim();
                dayMenu.splice(i, 1);
            }
            else {
                dayMenu[i] = dayMenu[i].trim();
            }
        }

        //convert to objects
        dayMenu = dayMenu.map(function(item, index) {
            var priced = parserUtil.parsePrice(item);
            return {isSoup: index === 0, text: normalize(priced.text), price: priced.price};
        });
        weekMenu.push({day: date.format('dddd'), menu: dayMenu});
    });

    callback(weekMenu);

    function parseDailyMenu(menuText, date) {
        var todayName = date.format("dddd");
        var tomorrowName = date.clone().add(1, "days").format("dddd");

        var startLine, endLine;
        for (var line in menuText) {
            if (menuText[line].toLowerCase().indexOf(todayName) !== -1) {
                startLine = +line;
            }
            if (startLine && /^–+$/.test(menuText[line].trim()) || //dashed separator line
                    (menuText[line].toLowerCase().indexOf(tomorrowName) !== -1)) //next day name
            {
                endLine = +line;
                break;
            }
        }
        if (startLine === undefined || (startLine >= endLine)) {
            return [];
        }

        var menuResult = menuText.slice(startLine, endLine);
        menuResult = menuResult.filter(function(line) {
            return /\S/.test(line);
        }); //remove empty lines
        menuResult = menuResult.filter(function(line) {
            return !/(Výmena prílohy|Pri účte 30 eur)/.test(line);
        }); //remove bonus information
        //remove name of the day from the first menu entry
        menuResult[0] = menuResult[0].substring(todayName.length).trim();
        return menuResult;
    }

    function normalize(str) {
        return str.replace(/(–)\1+/, '')
                .normalizeWhitespace()
                .removeItemNumbering()
                .removeMetrics()
                .correctCommaSpacing();
    }
};

