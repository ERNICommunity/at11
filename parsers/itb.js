var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];
    var dayMenu = [];

    global.dates.forEach(function(date) {
        var todayNameRegex = new RegExp("^\\s*" + date.format("dddd"), "i");

        if ($('td.cnt', '#contentBox').children('table').children().length > 1) {
            $('td.cnt', '#contentBox').children('table').each(function() {
                if (getDailyMenu(this, todayNameRegex))
                    return false;
            });
        } else {
            $('td.cnt', '#contentBox').children('table').children('tbody').children('tr').children('td').children('table').each(function() {
                if (getDailyMenu(this, todayNameRegex))
                    return false;
            });
        }

        weekMenu.push({ day: date.format("dddd"), menu: dayMenu });
    });
    callback(weekMenu);

    function getDailyMenu(element, todayNameRegex) {
        var precedingText = "";
        $(element).prevUntil('table').each(function () {
            precedingText = $(this).text() + precedingText;
        });
        if (todayNameRegex.test(precedingText)) {
            dayMenu = parseMenu($(element), precedingText);
            return true;
        }
        return false;
    }

    function parseMenu(table, mixedText) {
        var temp = [];
        if (mixedText.match(/zatvorené/i))
        {
            temp.push({ isSoup: false, text: "Dnes nie je menu", price: NaN });
            return temp;
        }
        table.find('tr').each(function() {
            var priced = parserUtil.parsePrice($(this).text());
            priced.text = normalize(priced.text);
            if (priced.text) temp.push({ isSoup: false, text: priced.text, price: priced.price });
        });

        var m = /Polievk[ay] ?0[,\.]33l ?:?(.+)Špec.*:(.+)delená.*:(.+)$/i.exec(mixedText);
        if (m)
        {
            var priced;
            for (var i = 3; i > 1; i--)
            {
                priced = parserUtil.parsePrice(m[i]);
                temp.unshift({ isSoup: false, text: normalize(priced.text), price: priced.price });
            }
            //soups (group 1)
            var soups = m[1].split(/€ ?,/);
            for (i = soups.length - 1; i >= 0; i--)
            {
                var txt = soups[i] + (i !== soups.length - 1 ? "€" : ""); //add back € to all items except last
                priced = parserUtil.parsePrice(txt);
                temp.unshift({ isSoup: true, text: normalize(priced.text), price: priced.price });
            }
        }
        return temp;
    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing()
            .toLowerCase()
            .capitalizeFirstLetter();
    }
};
