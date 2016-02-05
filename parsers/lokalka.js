var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    var todayTitle = date.format('dddd') + " " + date.format('DD.MM.YYYY');

    var elements = $('li.fdm-item', 'div.entry-content.post-content');
    elements.each(function(){
      var node = $(this);
      var title = node.find('p.fdm-item-title').text();
      if(isToday(title)){
        parseDailyMenu(node.find('table'));
        return false;
      }
    });

    callback(dayMenu);

    function isToday(title) {
      return title.toLowerCase().indexOf(todayTitle) !== -1;
    }

    function parseDailyMenu(table) {
      var rows = table.find('tr');
      rows.each(function(index, elem){
        if(index === 0){
          return;
        }
        if(index === 1){
          dayMenu.push(parseSoup(elem));
        }
        else{
          dayMenu.push(parseOther(elem));
        }
      });
    }

    function parseSoup(row) {
      var cells = $(row).find('td');
      return { isSoup: true, text: cells.eq(1).text() + " " + cells.eq(2).text(), price: parseFloat(cells.eq(4).text().replace(',', '.')) };
    }

    function parseOther(row) {
      var cells = $(row).find('td');
      return { isSoup: false, text: cells.eq(0).text(), price: parseFloat(cells.eq(2).text().replace(',', '.')) };
    }
  };
