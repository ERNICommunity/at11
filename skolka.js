var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);
        
        var menu = new Array();

        $('div.entry-content', '#post-2').children("p").each(function(){
            var now = new Date();
            var todayStr = now.getDate() + "." + now.getMonth() + "." + now.getFullYear();
            if(this.text().indexOf(todayStr) !== -1)
            {          
                menu.push(normalize(this.prev().contents().eq(1).text()));
                menu.push(normalize(this.text().replace(todayStr, "")));
                menu.push(normalize(this.next().text()));
                return false;
            }
        });
        
        return menu;

        function normalize(str) {
            return str.trim()
                    .replace(/\s\s+/g, ' ')
                    .replace(/^\d\.\s*/, '');
        }
    };
})();