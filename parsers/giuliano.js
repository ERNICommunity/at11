var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        $('.menublock').each(function() {
            var now = new Date();
            var todayStr = ("0" + now.getDate()).slice(-2) + ". " + ("0" + (now.getMonth() + 1)).slice(-2) + ". " + now.getFullYear();
            if (this.children("div").first().text().indexOf(todayStr) !== -1) {
                menu = this.children("div").eq(1).text().match(/[^\r\n]+/g);
                //I think it is safe enough to assume that the first item in menu is the soup
                if (menu.length > 0) {
                    menu[0] = "<div class=\"soup\">" + menu[0] + "</div>";
                }
                return false;
            }
        });

        return menu;
    };
})();
