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
        var menu;
		if (!error && response.statusCode === 200) {
            try
            {
                menu = parseCallback(body);
                if(!Array.isArray(menu))
                    throw "Invalid menu returned (expected array, got " + typeof menu + ")";
            }
            catch(e)
            {
                menu = ["Parser error", e];
            }         
		}
        else
        {
            menu = new Array();
            if(error)
                menu.push(error);
            if (response)
                menu.push("StatusCode: " + response.statusCode);
        }
        doneCallback(menu);
	});
}
