var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html, { decodeEntities: true });
    var result = [];

    var weekMenu = $('#privitanie').text();
    if (weekMenu) {
        var dateText = date.format('D.M.YYYY').replace(/\./g, '\\.');
        var regex = new RegExp(dateText + '((?:.|\r|\n)*?)NOVINKA!');
        var dayMenu = weekMenu.match(regex)[1];
        var menuTextNodes = dayMenu.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0)
            .map(l => l.normalizeWhitespace())
            .filter(l => /^(\d|A\/)/.test(l)); // 4 Jakub and other nonbelievers, this filters only lines that start with number or A/

        for (let i = 0; i < menuTextNodes.length; i++) {
            if(/A\//.test(menuTextNodes[i])) {
                var soups = menuTextNodes[i].split(/\s*[ABCD]\/\s*/).filter(l => l.length > 0)
                    .forEach(l => result.push({ isSoup: true, text: l, price: NaN }));
            } else {
                let text = menuTextNodes[i];
                let price = NaN;
                /* jshint -W083 */
                text = text.replace(/\d+,\d+\s?€/, (match) => {
                    price = parseFloat(match.replace(',', '.'));
                    return '';
                });
                /* jshint +W083 */
                result.push({ isSoup: false, text: normalize(text), price: price });
            }

        }
    }

    callback(result);

    function normalize(str) {
        return str.removeItemNumbering()
            .normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
