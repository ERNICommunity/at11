var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    var dayMenu = [];
    var weekMenu = [];

    global.dates.forEach(function(date) {
        var todayStr = date.format("D.M.YYYY");

        $('.daily-menu-for-day').each(function() {
            if($(this).children("header").first().text().indexOf(todayStr) !== -1) {
                dayMenu = parseMenu($(this));
                weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
            }
        });
    });

    callback(weekMenu);

    function parseMenu(elem) {
        var arr = [];
        var haveSoupAlready = false;

        elem.find('header.rm').each(function() {//Albatros puts soup in header
            var text = normalize($(this).children("h3").first().text());
            if(text === "" || $(this).children('.price').text()==='')
                return;
            var priceMatch = /(\d+[\.,]\d+) ?€/.exec($(this).children(".price").first().text().replace(",", "."));
            var price = priceMatch ? parseFloat(priceMatch[1]) : NaN;
            arr.push({ isSoup: true, text: text, price: price });
            haveSoupAlready = true;
        });

        elem.find('li').each(function() {
            var text = normalize($(this).children(".name").first().text());
            var priceMatch = /(\d+[\.,]\d+) ?€/.exec($(this).children(".price").first().text().replace(",", "."));
            var price = priceMatch ? parseFloat(priceMatch[1]) : NaN;
            var isSoup = false;
            if(!haveSoupAlready && !/ menu/.test(text))
            {
                haveSoupAlready = true;
                isSoup = true;
            }
            arr.push({ isSoup: isSoup, text: text, price: price });
        });
        return arr;
    }

    function normalize(str) {
        return str.normalizeWhitespace()
            .removeItemNumbering()
            .removeMetrics()
            .correctCommaSpacing();
    }
};
