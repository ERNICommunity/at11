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
    var pushingSoups = false;
    denneMenuElem.first().find('.jedlo_polozka').each(function() {
        var elem = $(this);
        var txt = elem.text().trim();

        if(txt === "Polievka"){
            pushingSoups = true;
            return;
        }
        if(txt === "Hlavné jedlá"){
            pushingSoups = false;
            return;
        }

        if(pushingSoups) {
            soupElems.push(elem);
        }
        else {
            mealElems.push(elem);
        }
    });

    soupElems.forEach((elem) => {
        var text = normalize($('.left', elem).text());
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
