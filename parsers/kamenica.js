var cheerio = require('cheerio');
var moment = require('moment-timezone');
require('./parserUtil');

module.exports.parse = function(html, callback) {

    var $ = cheerio.load(html);

    
    var weekMenu = [];
    var soupPattern = /0[\.,]\d+\s?l?$/;

    global.dates.forEach(function(date) {
        var dayOfWeek = parseInt(moment(date).format('e')) + 1;
        var dnesneMenu = $('.obedove-nadpis', '#content').eq(dayOfWeek).next().find('td').text().split('\n').filter(function(item){ return item; });
        var dayMenu = [];
        if(dnesneMenu.length === 1) {
            dayMenu.push("Dnes nie je menu");
        }
        else {
            dnesneMenu.forEach(function(item) {
                dayMenu.push(item);
            });
        }
        //convert to menu item object
        dayMenu = dayMenu.map(function(item) {
            return { isSoup: soupPattern.test(item.trim()), text: normalize(item), price: NaN };
        });

        weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
    });
    
    callback(weekMenu);

    function normalize(str) {
        return str.normalizeWhitespace()
            .replace(soupPattern,'')
            .removeMetrics()
            .correctCommaSpacing()
            .removeItemNumbering();
    }
  };
