var cheerio = require("cheerio");
var parserUtil = require("./parserUtil");

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];

    var menuText = $("div.entry-content").first().text().trim().split(/\n/).map(function(line) {
        return line.replace(/\t/g, "");
    });

    dayMenu = parseDailyMenu(menuText, date);

    //sometimes one menu item is scattered across multiple lines of HTML
    //if item does not start with number it should be added to previous one
    for (var i = 1; i < dayMenu.length; i++) {
        if (!/^\d/.test(dayMenu[i])) {
            dayMenu[i - 1] = dayMenu[i - 1] + " " + dayMenu[i].trim();
            dayMenu.splice(i, 1);
            i--;
        } else {
            dayMenu[i] = dayMenu[i].trim();
        }
    }

    //convert to objects
    dayMenu = dayMenu.map(function(item, index) {
        var priced = parserUtil.parsePrice(item);
        return { isSoup: index === 0, text: normalize(priced.text), price: priced.price };
    });

    callback(dayMenu);

    function parseDailyMenu(menuText, date) {
        var todayName = date.format("dddd");
        var tomorrowName = date.clone().add(1, "days").format("dddd");

        var startLine, endLine;
        for (var i = 0; i < menuText.length; i++) {
            if (menuText[i].toLowerCase().indexOf(todayName) !== -1) {
                startLine = i;
            }
            if (
                startLine &&
                (/^[-–—]+$/.test(menuText[i].trim()) || //dashed separator line
                menuText[i].toLowerCase().indexOf(tomorrowName) !== -1 || //next day name
                    menuText[i].toLowerCase().indexOf("alerg") !== -1)
            ) {
                //alergeny
                endLine = i;
                break;
            }
        }
        if (startLine === undefined || startLine >= endLine) {
            return [];
        }
        var menuResult = menuText.slice(startLine, endLine);
        menuResult = menuResult.filter(function(line) {
            return /\S/.test(line);
        }); //remove empty lines
        //remove name of the day from the first menu entry
        menuResult[0] = menuResult[0].substring(todayName.length).trim();

        return menuResult;
    }

    function normalize(str) {
        return str
            .replace(/(–)\1+/, "")
            .replace(/(\d,? ?)+$/, "")
            .normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
