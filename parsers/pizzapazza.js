var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports = new (function() {
	this.parse = function(html) {

		var $ = cheerio.load(html);

		var menu = new Array();
        
        //do parsing here
        
		return menu;
        
		function normalize(str) {
			return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
		}
	};
})();