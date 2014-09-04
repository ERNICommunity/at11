var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];

    var menuPic = $('img[src*="dm-vg"]').attr('src');
    if(menuPic)
    {
        request.post({
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            url: 'http://at11ocr.azurewebsites.net/api/process/url',
            body: "=" + encodeURIComponent(menuPic)
        }, function(error, response, body) {
            if (!error)
            {
                parseMenu(body);
            }
            callback(weekMenu);
        });
    }
    else//no picture, try to parse html
    {
        global.dates.forEach(function(date) {
            var dayMenu = [];
            var todayNameReg = new RegExp("^\\s*" + date.format("dddd"), "i");
	    var nextNameReg = new RegExp("^\\s*" + date.clone().add("days",1).format("dddd"), "i");
            $("table", "div#content").first().find("tr").each(function() {
                var row = $(this);
                if(todayNameReg.test(row.text())) {
                    row = row.next();
                    while(!nextNameReg.test(row.text()) && !/Šalátové menu/.test(row.text())) {
                        var item = parseItem(row);
                        if(item)
                            dayMenu.push(item);
                        row = row.next();
                    }
                    return false;
                }
            });
            weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
        });

        callback(weekMenu);
    }

    function parseItem(row)
    {
        var item = {isSoup: false};
        item.text = normalize(row.children('td').first().text()).replace(/^polievka:?\s*/i, function(){
            item.isSoup = true;
            return "";
        });
        item.price = parseFloat(row.children('td').eq(3).text().replace(",", ".")); 
        return item;
    }

    function parseMenu(menuString)
    {
        var lines = menuString.split('\n').filter(function(val) {
            return val.trim();
        });
        global.dates.forEach(function(date) {
            var dayMenu = [];
            var todayRegEx = new RegExp(date.format('dddd'), 'i');
            var tomorrowRegEx = new RegExp(date.clone().add('days', 1).format('dddd') + "|šalát", 'i');//friday ends with salatove menu
            for(var i = 0; i < lines.length; i++) {
                if(todayRegEx.test(lines[i])) {
                    i++;
                    while(!tomorrowRegEx.test(lines[i])) {
                        dayMenu.push(lines[i]);
                        i++;
                    }
                    break;
                }
            }

            dayMenu = dayMenu.map(function(item) {
                var priced = parserUtil.parsePrice(normalize(item));
                return { isSoup: /polievka/i.test(priced.text), text: priced.text.replace(/polievka:\s*/i, ""), price: priced.price };
            });

            weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
        });

        callback(weekMenu);
    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .tidyAfterOCR()
            .replace(/[\d\s,]*$/, "")
            .removeMetrics();
    }
};