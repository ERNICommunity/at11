var request = require('request');
var cache = require('./cache');

module.exports = new (function() {
	this.fetchMenu = function(url, name, parseCallback, doneCallback) {
		var menuObj = cache.get(url);
		if (menuObj)
			doneCallback({name: name, menu: menuObj});
        else
			load(url, parseCallback, function(menuObj){
                cache.set(url, menuObj);
                doneCallback({name: name, menu: menuObj});
            });
	};
})();

function load(url, parseCallback, doneCallback) {
	request(url, function(error, response, body) {
		if (!error && response.statusCode === 200) {
            var menu = parseCallback(body);
            if(Array.isArray(menu))
                doneCallback(menu);
            else
                doneCallback(null);
		}
        else
            doneCallback([error + " " + response.statusCode]);
	});
}
