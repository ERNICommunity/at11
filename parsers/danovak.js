var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html, { decodeEntities: true });
    var dayMenu = [];

    var currentDay = $('div#privitanie>div').children().filter(function(index, item) { return $(item).text().indexOf(date.format("DD.MM.YYYY")) > -1; }).eq(0);
    if (currentDay) {
        let menuHolder = currentDay.next();
        let menuTextNodes = menuHolder.contents().filter(function() { return this.type === 'text'; });

        menuTextNodes[0].data.trim().split(/\//g).forEach(function(itemTxt) { // on first line there are soups separated by '/'
            dayMenu.push({ isSoup: true, text: itemTxt.trim(), price: NaN });
        });
        for (let i = 1; i < menuTextNodes.length; i++) {
            let text = menuTextNodes[i].data.trim();
            let price = NaN;
            /* jshint -W083 */
            text = text.replace(/\d+,\d+\s?€/, (match) => {
                price = parseFloat(match.replace(',', '.'));
                return '';
            });
            /* jshint +W083 */
            dayMenu.push({ isSoup: false, text: normalize(text), price: price });
        }
    }

    callback(dayMenu);

    function normalize(str) {
        return str.removeItemNumbering()
            .normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
