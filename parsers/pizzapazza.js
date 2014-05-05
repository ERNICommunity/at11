var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports = new (function() {
    this.parse = function(html, callback) {

        var $ = cheerio.load(html);

        var menu = new Array();

        var menuPic = $('img[src*="ponuka"]').attr('src');

        request.post({
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            url: 'http://at11ocr.azurewebsites.net/api/process/url',
            body: "=" + encodeURIComponent(menuPic)
        }, function(error, response, body) {
            if (!error)
            {
                //do the real parsing here
                menu.push({ isSoup: false, text: "success (sort of)", price: NaN });
            }
            callback(menu);
        });

        function normalize(str) {
            return str.normalizeWhitespace()
				.removeItemNumbering();
        }
    };
})();