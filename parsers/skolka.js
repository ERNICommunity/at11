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
                url: 'http://localhost:64581/api/process/encoded',
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

        function parseMenu(menuString) {

            var lines = menuString.split("\n").filter(function(val) {
                return !/^\s*$/.test(val);
            });
            var now = global.todaysDate;
            var todayReg = new RegExp("^\\s*0?" + now.date() + "\\.\\s*0?" + (now.month() + 1) + "\\.\\s*" + now.year());
            var dayReg = new RegExp("^" + now.format("dddd"), "i");
            var price;
            for (var i = 0; i < lines.length; i++)
            {
                if (dayReg.test(lines[i]))
                {
                    menu.push(normalize(lines[i].replace(dayReg, "")) || "Dnes nie je menu");
                    if (menu[0] == "Dnes nie je menu") { break; }
                    menu.push(normalize(lines[i + 1].replace(todayReg, "")));
                    menu.push(normalize(lines[i + 2]));
                }
                if (/Hodnota stravy/.test(lines[i]))
                {
                    price = parserUtil.parsePrice(lines[i]).price;
                }
            }

            //convert to menu item object
            menu = menu.map(function(item, index) {
                return { isSoup: index === 0 && item != "Dnes nie je menu", text: item, price: index === 0 ? NaN : price };
            });

            callback(menu);
        }

        function normalize(str) {
            return str.normalizeWhitespace()
				.removeItemNumbering()
                .removeMetrics();
        }
    };
})();