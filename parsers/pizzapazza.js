var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports = new (function() {
    this.parse = function(html, callback) {

        var $ = cheerio.load(html);

        var menu = new Array();

        var menuPic = $('img[src*="dm-vg"]').attr('src');

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

        function parseMenu(menuString) {

            var lines = menuString.split('\n');
            var todayRegEx = new RegExp(global.todaysDate.format('dddd'), 'i');
            var tomorrowRegEx = new RegExp(global.todaysDate.add('days', 1).format('dddd'), 'i');
            for (var i = 0; i < lines.length; i++)
            {
                if (todayRegEx.test(lines[i]))
                {
                    i++;
                    while (!tomorrowRegEx.test(lines[i]))
                    {
                        if (lines[i].trim() != "") { menu.push(lines[i]); }
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
})();