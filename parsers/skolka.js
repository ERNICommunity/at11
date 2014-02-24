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
			var now = new Date();
			var todayReg = new RegExp("^\\s*0?" + now.getDate() + "\\.\\s*0?" + (now.getMonth() + 1) + "\\.\\s*" + now.getFullYear());
			if (todayReg.test(lines[i]))
			{
				menu.push(normalize(lines[i - 1].replace(/^\s*\w+\s+/, "")));
				menu.push(normalize(lines[i].replace(todayReg, "")));
				menu.push(normalize(lines[i + 1]));
				break;
			}
		}

		return menu;

		function normalize(str) {
			return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
		}
	};
})();