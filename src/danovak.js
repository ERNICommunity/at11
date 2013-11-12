var request = require('request');
var cheerio = require('cheerio');
var cache = require('./cache');

module.exports = new (function() {
	this.readDailyMenu = function(callback) {
		var restaurant = cache.get('danovak-daily');
		if (restaurant) {
			callback(restaurant);
		} else {
			load(function(restaurant) {
				cache.set('danovak-daily', restaurant);
				callback(restaurant);
			});
		}
	};
})();

function load(callback) {
	loadUrl(function(html) {
		var menu = parse(html);
		callback({name: 'U Daňováka', menu: menu});
	});
}

function loadUrl(callback) {
	var url = 'http://www.obedovat.sk/restauracia/6801-u-danovaka/denne-menu';
	request(url, function(err, res, body) {
		if (!!err) {
			throw err;
		}				
		callback(body);
	});
}

function parse(html) {

	var $ = cheerio.load(html);

	var normalize = function(str) {
		return str.trim()
			.replace(/\s\s+/g, ' ')
			.replace(/^\d\.\s*/, '');
	}

	var parseMenu = function(elem) {
		return $(elem).find('li').map(function() {
			var text = $(this).text();
			return normalize(text);	
		});
	};
	
	var first;

	$('.daily-menu-for-day').each(function() {		
		var menu = parseMenu(this);
		if (!first && menu.length > 0) {			
			first = menu;
		}
	});

	return first;
}