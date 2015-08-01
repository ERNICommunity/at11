var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, callback) {
    var $ = cheerio.load(html);
    var menuTable = $("table#menu").first();
    
    var weekMenu = [];

    global.dates.forEach(function(date) {
        var dayMenu = [];
        var todayName = date.format("dddd");
        menuTable.find("tr").each(function() {
            var cells = $(this).children("td");
            if (cells.eq(1).find("h3").text().indexOf(todayName) > -1) {
                var item = parseItem(cells);
                if (item){
                    dayMenu.push(item);
                }
            }
        });
        weekMenu.push({ day: todayName, menu: dayMenu });
    });

    callback(weekMenu);

    function parseItem(cells) {
        var item = { isSoup: cells.eq(1).find("h3").text().indexOf("Polievka") > -1 };
        cells.eq(1).find("p").find("br").text(" - ");
        item.text = cells.eq(1).find("p").text().normalizeWhitespace();
        item.price = parseFloat(cells.eq(3).text().replace(",", "."));
        return item;
    }
};
