var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var menu = [];

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
            callback(menu);
        });
    }
    else//no picture, try to parse html
    {
        var todayNameReg = new RegExp("^\\s*" + global.todaysDate.format("dddd"), "i");
        $("table","div#content").first().find("tr").each(function(){
            var row = $(this);
            if(todayNameReg.test(row.text()))
            {
                row = row.next();
                while(row.text().trim() !== "")
                {
                    var item = parseItem(row);
                    if(item)
                        menu.push(item);
                    row = row.next(); 
                }
                return false;
            }
        });
        callback(menu);
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
        var todayRegEx = new RegExp(global.todaysDate.format('dddd'), 'i');
        var tomorrowRegEx = new RegExp(global.todaysDate.clone().add('days', 1).format('dddd')+ "|šalát", 'i');//friday ends with salatove menu
        for (var i = 0; i < lines.length; i++)
        {
            if (todayRegEx.test(lines[i]))
            {
                i++;
                while (!tomorrowRegEx.test(lines[i]))
                {
                    menu.push(lines[i]);
                    i++;
                }
                break;
            }
        }

        menu = menu.map(function(item) {
            var priced = parserUtil.parsePrice(normalize(item));
            return { isSoup: /polievka/i.test(priced.text), text: priced.text.replace(/polievka:\s*/i, ""), price: priced.price };
        });

        callback(menu);

    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .tidyAfterOCR()
            .replace(/[\d\s,]*$/, "")
            .removeMetrics();
    }
};