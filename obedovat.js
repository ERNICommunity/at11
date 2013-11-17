var request = require('request');
var cheerio = require('cheerio');
var cache = require('./cache');

module.exports = new (function() {
	this.readDailyMenu = function(callback, urlIdent, name) {
		var restaurant = cache.get(urlIdent+'-daily');
		if (restaurant) {
			callback(restaurant);
		} else {
			load(function(restaurant) {
				cache.set(urlIdent+'-daily', restaurant);
				callback(restaurant);
			}, urlIdent, name);
		}
	};
})();

function load(callback, urlPart, name) {
	loadUrl(function(html) {
		var menu = parse(html);
		callback({name: name, menu: menu});
	}, urlPart, name);
}

function loadUrl(callback, urlPart) {
	var url = 'http://www.obedovat.sk/restauracia/'+urlPart+'/denne-menu';
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
	};

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