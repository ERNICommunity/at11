var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var menu = new Array();

		var dayIndex = 0;
        $('.editor-content > div:nth-child(2) > table:nth-child(1) > tbody').children().each(function() {
			if(this.text().indexOf("Polievka") !== -1){
				dayIndex++;
			}
			if(dayIndex === new Date().getDay())
			{
				menu = menu.concat(parseDaily(this));
				dayIndex = Number.POSITIVE_INFINITY;
			}
			if(this.text().indexOf('Týždenné menu') !== -1)
				menu = menu.concat(parseWeekly(this));
			if(this.text().indexOf('Šalátové menu') !== -1)
				menu = menu.concat(parseSalads(this));
			if(this.text().indexOf('Pizza menu') !== -1)
				menu = menu.concat(parsePizza(this));
			if(this.children('th').length > 0 && this.text().indexOf("Hron") !== -1)//too far
				return false;
        });

        return menu;

        function parseDaily(elem) {
            var arr = new Array();
			arr.push(elem.children().first().contents().eq(2).text());
			arr.push(normalize(elem.next().text()));
            arr.push(normalize(elem.next().next().text()));
            return arr;
        }
		
		function parseWeekly(elem) {
            var arr = new Array();
			arr.push(normalize(elem.next().text()));
            return arr;
        }
		
		function parseSalads(elem) {
            var arr = new Array();
			arr.push(normalize(elem.next().text()));
			arr.push(normalize(elem.next().next().text()));
			arr.push(normalize(elem.next().next().next().text()));
            return arr;
        }
		function parsePizza(elem) {
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