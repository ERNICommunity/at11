var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function () {
    this.parse = function (html, callback) {

        var $ = cheerio.load(html);

        var menu = [];
        var todayStr = global.todaysDate.format("DD. MM. YYYY");

        $('.menublock').each(function () {
            var leftCellText = $(this).children("div").first().text();
            if (leftCellText.indexOf(todayStr) !== -1) {
                var match = /€(\d[\.,]\d{2})/.exec(leftCellText);
                var price = match ? parseFloat(match[1]) : NaN;
                var items = $(this).children("div").eq(1).text().match(/[^\r\n]+/g);
                menu = items.map(function(item, index){
                    var tmp = {isSoup: false, text: normalize(item), price: price };
                    if(index === 0) {//I think it is safe enough to assume that the first item in menu is the soup
                        tmp.isSoup = true;
                        tmp.price = NaN;
                    }
                    return tmp;
                });
                return false;
            }
        });

        function normalize(str) {
            return str.normalizeWhitespace()
                .removeMetrics();
        }
        
        callback(menu);
    };
})();
