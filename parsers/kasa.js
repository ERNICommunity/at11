var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    
    var dateStr = date.format("DD.MM.YYYY");

    var denneMenuElem = $('.dnesne_menu, .ostatne_menu').filter(function(){
        var nadpis = $(this).find('h2').text();
        return nadpis.indexOf(dateStr) > -1;
    });
    
    var soupElems = [];
    var mealElems = [];
    denneMenuElem.first().find('.jedlo_polozka').each(function(index) {
        var elem = $(this);
        if(index === 0) {
            soupElems.push(elem);
        }
        else {
            mealElems.push(elem);
        }
    });

    soupElems.forEach((elem) => {
        var text = normalize($('.left', elem).text());
        text = text.replace(/polievka:?\s*/, '');
        dayMenu.push({ isSoup: true, text: text, price: NaN });
    });

    mealElems.forEach((elem) => {
        var text = normalize($('.left', elem).text());
        var price = parseFloat($('.right', elem).text().trim());
        dayMenu.push({ isSoup: false, text: text, price: price });
    });
    
    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
};
