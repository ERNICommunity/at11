var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];

    $('table#denne-menu tr').each(function() {
        var $this = $(this);
        var dateCellText = $this.children("td").first().text();

        if (dateCellText.indexOf(date.format("DD.MM.YYYY")) > -1)
        {
            var items = $this.children("td").eq(1).text().match(/[^\r\n]+/g);

            var priceText = $this.children("td").eq(2).text();
            var price = parseFloat(priceText.replace(",", "."));

            dayMenu = items.map(function(item, index) {
                var tmp = { isSoup: false, text: normalize(item), price: price };
                if (index === 0)
                {//I think it is safe enough to assume that the first item in menu is the soup
                    tmp.isSoup = true;
                    tmp.price = NaN;
                }
                return tmp;
            });
            return false;
        }
    });

    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
