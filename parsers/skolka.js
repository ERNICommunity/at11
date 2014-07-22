var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];

    var pic = $('.entry-content img');
    var action;

    if (pic.parent().filter("a").length > 0)
    {
        pic = pic.parent().attr('href');
        action = "url";
    }
    else
    {
        pic = pic.attr('src');
        action = "encoded";
    }

    if (pic) {
        request.post({
            headers: {'Content-type': 'application/x-www-form-urlencoded'},
            url: 'http://at11ocr.azurewebsites.net/api/process/' + action,
            body: "=" + encodeURIComponent(pic)
        }, function(error, response, body) {
            if (!error) {
                parseMenu(body);
            }
            callback(weekMenu);
        });
    }
    else {
        parseMenu($('div.entry-content', '#post-2').text());
    }

    function parseMenu(menuString) {
        var lines = menuString.split("\n").filter(function(val) {
            return val.trim();
        });
        global.dates.forEach(function(date) {
            var dayMenu = [];
            var dateReg = new RegExp("^\\s*0?" + date.date() + "\\.\\s*0?" + (date.month() + 1) + "\\.\\s*" + date.year());
            var todayNameReg = new RegExp("^\\s*" + date.format("dddd"), "i");
            var price;
            for (var i = 0; i < lines.length; i++) {
                if (todayNameReg.test(lines[i])) {
                    for (var offset = 0; offset < 3; offset++)//3 menu lines each day
                    {
                        var txt = lines[i + offset];
                        if (offset === 0)
                            txt = txt.replace(todayNameReg, "");
                        if (offset === 1)
                            txt = txt.replace(dateReg, "");
                        txt = normalize(txt);
                        if (txt)
                            dayMenu.push(txt);
                    }
                }
                if (/Hodnota stravy/.test(lines[i]))
                    price = parserUtil.parsePrice(lines[i]).price;
                else
                    price = NaN;
            }

            //convert to menu item object
            dayMenu = dayMenu.map(function(item, index) {
                return {isSoup: /polievka/i.test(item), text: item, price: index === 0 ? NaN : price};
            });

            weekMenu.push({day: date.format('dddd'), menu: dayMenu});
        });

        callback(weekMenu);
    }

    function normalize(str) {
        return str.tidyAfterOCR()
                .removeItemNumbering()
                .removeMetrics()
                .normalizeWhitespace()
                .correctCommaSpacing();
    }
};