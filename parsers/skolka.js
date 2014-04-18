var cheerio = require('cheerio');

module.exports = new (function() {
	this.parse = function(html) {

		var $ = cheerio.load(html);

		var menu = new Array();

		var lines = $('div.entry-content', '#post-2').text().split("\n").filter(function(val) {
			return !/^\s*$/.test(val);
		});
		for (var i = 0; i < lines.length; i++)
		{
		    var now = global.todaysDate;
			var todayReg = new RegExp("^\\s*0?" + now.getDate() + "\\.\\s*0?" + (now.getMonth() + 1) + "\\.\\s*" + now.getFullYear());
			if (todayReg.test(lines[i]))
			{
				menu.push(normalize(lines[i - 1].replace(/^\s*\S+\s+/, "")));
				menu.push(normalize(lines[i].replace(todayReg, "")));
				menu.push(normalize(lines[i + 1]));
				break;
			}
		}

        //I think it is safe enough to assume that the first item in menu is the soup
        if (menu.length > 0){
            menu[0] = "<div class=\"soup\">" + menu[0] + "</div>";
        }

		return menu;

		function normalize(str) {
			return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
		}
	};
})();