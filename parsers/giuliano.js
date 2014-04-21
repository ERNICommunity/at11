var cheerio = require('cheerio');

module.exports = new (function () {
    this.parse = function (html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        var now = global.todaysDate;
        var todayStr = ("0" + now.getDate()).slice(-2) + ". " + ("0" + (now.getMonth() + 1)).slice(-2) + ". " + now.getFullYear();

        $('.menublock').each(function () {
            if ($(this).children("div").first().text().indexOf(todayStr) !== -1) {
                var items = $(this).children("div").eq(1).text().match(/[^\r\n]+/g);
                menu = items.map(function(item, index){
                    var tmp = {isSoup: false, text: item};
                    if(index === 0) //I think it is safe enough to assume that the first item in menu is the soup
                        tmp.isSoup = true;
                    return tmp;
                });
                return false;
            }
        });

        return menu;
    };
})();
