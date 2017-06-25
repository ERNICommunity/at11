var cheerio = require("cheerio");
require("./parserUtil");

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html, { normalizeWhitespace: true });
    var dayMenu = [];

    $("table#denne-menu tr").each(function() {
        var $this = $(this);
        var dateCellText = $this.children("td").first().text();

        if (dateCellText.indexOf(date.format("DD.MM.YYYY")) > -1) {
            var items = $this.children("td").eq(1).children().filter(function() {
                var txt = $(this).text().trim();
                if (txt === "") {
                    return false;
                }
                var cnt = cheerio.load(txt);
                cnt
                    .root()
                    .contents()
                    .filter(function() {
                        return this.type === "comment";
                    })
                    .remove(); // strip comments
                return cnt.text().trim() !== "";
            });

            var priceText = $this.children("td").eq(2).text();
            var price = parseFloat(priceText.replace(",", "."));

            Array.prototype.forEach.call(items, function(item, index) {
                var tmp = { isSoup: false, text: normalize($(item).text()), price: price };
                if (index === 0) {
                    //I think it is safe enough to assume that the first item in menu is the soup
                    tmp.isSoup = true;
                    tmp.price = NaN;
                }
                dayMenu.push(tmp);
            });
            return false;
        }
    });

    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace().removeMetrics().correctCommaSpacing();
    }
};
