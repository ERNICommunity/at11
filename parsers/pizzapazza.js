var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    
    var menuTable = $("table#menu").first();
    var todayName = date.format("dddd");
    
    menuTable.find("tr").each(function() {
        var cells = $(this).children("td");
        if (cells.eq(1).find("h3").text().indexOf(todayName) > -1) {
            dayMenu.push(parseItem(cells));
        }
    });
    
    callback(dayMenu);

    function parseItem(cells) {
        var item = { isSoup: cells.eq(1).find("h3").text().indexOf("Polievka") > -1 };
        cells.eq(1).find("p").find("br").text(" - ");
        item.text = cells.eq(1).find("p").text().normalizeWhitespace();
        item.price = parseFloat(cells.eq(3).text().replace(",", "."));
        return item;
    }
};
