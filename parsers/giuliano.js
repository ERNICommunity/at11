var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function (html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];
    var dayMenu = [];

    $('.menublock > .row').each(function () {
        var $this = $(this);
        var dateCellText = $this.children(".dayname").first().text();
        global.dates.forEach(function (date) {
            if (dateCellText.indexOf(date.format("DD. MM. YYYY")) !== -1)
            {
				var items = $this.children("div").eq(1).text().match(/[^\r\n]+/g);
				
                var match = /(\d[\.,]\d{2})€/.exec(items[0]);
                var price = match ? parseFloat(match[1].replace(",", ".")) : NaN;
				items.shift();
                
                dayMenu = items.map(function (item, index) {
                    var tmp = { isSoup: false, text: normalize(item), price: price };
                    if (index === 0)
                    {//I think it is safe enough to assume that the first item in menu is the soup
                        tmp.isSoup = true;
                        tmp.price = NaN;
                    }
                    return tmp;
                });
                weekMenu.push({ day: date.format("dddd"), menu: dayMenu });
            }
        });
    });

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }

    callback(weekMenu);
};
