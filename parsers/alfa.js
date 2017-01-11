var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    
    var soupPattern = /^0[\.,]\d+\s?l/;
    var dateStr = date.format("DD.MM.YYYY");

    var denneMenu = $('.dnesne_menu, .ostatne_menu').filter(function(){
        var nadpis = $(this).find('h2').text();
        return nadpis.indexOf(dateStr) > -1;
    });
    
    denneMenu.first().find('.jedlo_polozka').each(function() {
        if($(this).find('.left>b').length === 0) {
            dayMenu.push(this);
        }
    });

    // assumption - first one is soup
    var soupsElement = dayMenu[0];
    var soupNames = normalize($('.left', soupsElement).text().trim()).split(',');
    var soupPrice = parseFloat($('.right', soupsElement).text());

    var soupMenu = soupNames.map(function(item) { return { isSoup: true, text: item.trim(), price: soupPrice }; });

    //convert to menu item object
    dayMenu = dayMenu.slice(1).map(function(item) {
        var label = $('.left', item).text();
        var price = $('.right', item).text();
        return { isSoup: soupPattern.test(label.trim()), text: normalize(label), price: parseFloat(price) };
    });

    dayMenu = soupMenu.concat(dayMenu);
    
    callback(dayMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .replace(soupPattern, '')
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
};
