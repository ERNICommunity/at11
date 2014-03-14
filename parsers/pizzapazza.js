var cheerio = require('cheerio');

module.exports = new (function() {
	this.parse = function(html) {

		var $ = cheerio.load(html);

		var menu = new Array();

		var days = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
		$('.editor-content > div:nth-child(2) > table:nth-child(1) > tbody').children('tr').each(function() {
			if (new RegExp(days[new Date().getDay()], 'i').test(this.text())) {
				menu = menu.concat(parseDaily(this));
			}
			if (this.text().indexOf('VIP menu') !== -1 ||
				this.text().indexOf('Týždenné menu') !== -1)
				menu = menu.concat(parseOne(this));
			if (this.text().indexOf('Šalátové menu') !== -1 ||
				this.text().indexOf('Pizza menu') !== -1)
				menu = menu.concat(parseThree(this));
			if (this.children('th').length > 0 && this.text().indexOf("Hron") !== -1)//too far
				return false;
		});

        //I think it is safe enough to assume that the first item in menu is the soup
        if (menu.length > 0){
            menu[0] = "<div class=\"soup\">" + menu[0] + "</div>";
        }

		return menu;

		function parseDaily(elem) {
			var arr = new Array();
			arr.push(elem.text().replace(/^[\s\S]+polievka:\s+/i, ''));
			arr.push(normalize(elem.next().text()));
			arr.push(normalize(elem.next().next().text()));
			return arr;
		}

		function parseOne(elem) {
			var arr = new Array();
			arr.push(normalize(elem.next().text()));
			return arr;
		}

		function parseThree(elem) {
			var arr = new Array();
			arr.push(normalize(elem.next().text()));
			arr.push(normalize(elem.next().next().text()));
			arr.push(normalize(elem.next().next().next().text()));
			return arr;
		}

		function normalize(str) {
			return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
		}
	};
})();