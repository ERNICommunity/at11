var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    
    var soupPattern = /^0[\.,]\d+\s?l/;
    var dateStr = date.format("DD.MM.YYYY");

    var denneMenu = $('.dnesne_menu, .ostatneMenu').filter(function(){
        var nadpis = $(this).find('h2').text();
        return nadpis.indexOf(dateStr) > -1;
    });
    
    denneMenu.first().find('.jedlo_polozka').each(function() {
        if($(this).find('.left>b').length === 0) {
            dayMenu.push(this);
        }
    });

    //convert to menu item object
    dayMenu = dayMenu.map(function(item) {
        var label = $('.left', item).text();
        var price = $('.right', item).text();
        return { isSoup: soupPattern.test(label.trim()), text: normalize(label), price: parseFloat(price) };
    });
    
    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .replace(soupPattern, '')
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
};
