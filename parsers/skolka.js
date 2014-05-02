var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

        var lines = $('div.entry-content', '#post-2').text().split("\n").filter(function(val) {
            return !/^\s*$/.test(val);
        });
        var now = global.todaysDate;
        var todayReg = new RegExp("^\\s*0?" + now.date() + "\\.\\s*0?" + (now.month() + 1) + "\\.\\s*" + now.year());
        var dayReg = new RegExp("^" + now.format("dddd"), "i");
        for (var i = 0; i < lines.length; i++)
        {
            if (dayReg.test(lines[i]))
            {
                menu.push(normalize(lines[i].replace(dayReg, "")) || "Dnes nie je menu");
                if (menu[0] == "Dnes nie je menu") { break; }
                menu.push(normalize(lines[i + 1].replace(todayReg, "")));
                menu.push(normalize(lines[i + 2]));
                break;
            }
        }

        //convert to menu item object
        menu = menu.map(function(item, index) {
            return { isSoup: index === 0 && item != "Dnes nie je menu", text: item, price: NaN };
        });

        return menu;

        function normalize(str) {
            return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
        }
    };
})();