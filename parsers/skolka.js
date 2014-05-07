var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports = new (function() {
    this.parse = function(html, callback) {

        var $ = cheerio.load(html);

        var menu = new Array();

        var pic = $('.entry-content img').attr('src');

        if (pic)
        {
            request.post({
                headers: { 'Content-type': 'application/x-www-form-urlencoded' },
                url: 'http://at11ocr.azurewebsites.net/api/process/encoded',
                body: "=" + encodeURIComponent(pic)
            }, function(error, response, body) {
                if (!error)
                {
                    parseMenu(body);
                }
                callback(menu);
            });
        }
        else
        {
            parseMenu($('div.entry-content', '#post-2').text());
        }

        function parseMenu(menuString)
        {
            var lines = menuString.split("\n").filter(function(val) {
                return val.trim();
            });
            var now = global.todaysDate;
            var dateReg = new RegExp("^\\s*0?" + now.date() + "\\.\\s*0?" + (now.month() + 1) + "\\.\\s*" + now.year());
            var todayNameReg = new RegExp("^" + now.format("dddd"), "i");
            var price;
            for (var i = 0; i < lines.length; i++)
            {
                if (todayNameReg.test(lines[i]))
                {
                    for(var offset = 0; offset < 3; offset++)//3 menu lines each day
                    {
                        var txt = lines[i+offset];
                        if(offset === 0)
                            txt = txt.replace(todayNameReg, "");
                        if(offset === 1)
                            txt = txt.replace(dateReg, "");   
                        txt = normalize(txt);
                        if(txt)
                            menu.push(txt);
                    }
                }
                if (/Hodnota stravy/.test(lines[i]))
                {
                    price = parserUtil.parsePrice(lines[i]).price;
                }
            }

            //convert to menu item object
            menu = menu.map(function(item, index) {
                return { isSoup: /polievka/i.test(item), text: item, price: index === 0 ? NaN : price };
            });

            callback(menu);
        }

        function normalize(str) {
            return str.tidyAfterOCR()
				.removeItemNumbering()
                .removeMetrics()
                .normalizeWhitespace()
                .correctCommaSpacing();
        }
    };
})();