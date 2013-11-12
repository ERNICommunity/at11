var request = require('request');
var cheerio = require('cheerio');
var cache = require('./cache');

module.exports = new (function() {
	this.readDailyMenu = function(callback) {
		var restaurant = cache.get('giuliano-daily');
		if (restaurant) {
			callback(restaurant);
		} else {
			load(function(restaurant) {
				cache.set('giuliano-daily', restaurant);
				callback(restaurant);
			});
		}
	};
})();

function load(callback) {
	loadUrl(function(html) {
		var menu = parse(html);
		callback({name: 'Giuliano', menu: menu});
	});
}

function loadUrl(callback) {
	var url = 'http://www.giuliano.sk/sk/denne-menu/';
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
	
	var text = $('.menublock').children('div').eq(1).text();	
	
	return text.match(/[^\r\n]+/g);
}