var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();
        
        $('.menublock').each(function(){
            var now = new Date();
            var todayStr = ("0" + now.getDate()).slice(-2) + ". " + ("0" + now.getMonth()).slice(-2) + ". " + now.getFullYear();
            if(this.children("div").first().text().indexOf(todayStr) !== -1)
            {
                menu = this.children("div").eq(1).text().match(/[^\r\n]+/g);
                return false;
            }
        });

        return menu;
    };
})();
