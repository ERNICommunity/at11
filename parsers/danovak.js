var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    let $ = cheerio.load(html, { decodeEntities: true });
    let result = [];

    let weekMenu = $('#privitanie').text();
    if (weekMenu) {
        let regex = createRegex(date);
        let dayMenu = weekMenu.match(regex)[1];
        let menuTextNodes = dayMenu.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0)
            .map(l => l.normalizeWhitespace())
            .filter(l => /^(\d|A\/)/.test(l)); // 4 Jakub and other nonbelievers, this filters only lines that start with number or A/

        /* jshint -W083 */
        for (let i = 0; i < menuTextNodes.length; i++) {
            if(/0,/.test(menuTextNodes[i])) {
                let text = menuTextNodes[i];
                result.push({ isSoup: true, text: normalize(text), price: NaN });
                continue;
            }
            
            let text = menuTextNodes[i];
            let price = NaN;
            text = text.replace(/\d+,\d+\s?€/, (match) => {
                price = parseFloat(match.replace(',', '.'));
                return '';
            });
            result.push({ isSoup: false, text: normalize(text), price: price });
        }
        /* jshint +W083 */
    }

    callback(result);

    function normalize(str) {
        return str.removeItemNumbering()
            .normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing();
    }

    function createRegex(date)
    {
        let datePattern = createDatePattern(date);
        if (date.isoWeekday() === 5) {
            // it's finally Friday
            return new RegExp(datePattern + '(.*)$', 'sm');
        }
        
        let next = date.clone().add(1, 'd');
        let nextPattern = createDatePattern(next);
        return new RegExp(datePattern + '((?:.|\r|\n)*?)' + nextPattern);
    
        function createDatePattern(moment) {
            let dd = moment.date().toString();
            if (dd.length < 2) {
                dd = '0?' + dd;
            }
            let mm = (moment.month() + 1).toString();
            if (mm.length < 2) {
                mm = '0?' + mm;
            }
            let yyyy = moment.year().toString();
            return dd + '\\.' + mm + '\\.' + yyyy;
        }
    }
};
