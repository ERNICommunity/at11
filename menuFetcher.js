var request = require('request');
var cache = require('./cache');
var parserUtil = require('./parsers/parserUtil.js');

module.exports = new (function () {
    this.fetchMenu = function (id, url, name, parseCallback, doneCallback) {
        var menuObj = cache.get(url);
        if (menuObj && !global.devMode)
            doneCallback({ id: id, name: name, url: url, menu: menuObj });
        else
            load(url, parseCallback, function (menuObj) {
                cache.set(url, menuObj);
                doneCallback({ id: id, name: name, url: url, menu: menuObj });
            });
    };
})();

function load(url, parseCallback, doneCallback) {
    request(url, function (error, response, body) {
        var menu;
        if (!error && response.statusCode === 200) {
            try {
                menu = parseCallback(body);
                
                if (!Array.isArray(menu))
                    throw "Invalid menu returned (expected array, got " + typeof menu + ")";
                
                //check if each menu item has isSoup and text attributes
                menu.forEach(function(item){
                    if(typeof item !== "object")
                        throw "Each item should be object, but got " + typeof item;
                    if(typeof item.isSoup !== "boolean")
                        throw "Menu item does not contain 'isSoup' flag";
                    if(typeof item.text !== "string")
                        throw "Menu item does not contain 'text' property";
                    
                    var removedMetrics = parserUtil.removeMetrics(item.text);
                    var priced = parserUtil.parsePrice(removedMetrics);
                    item.price = priced.price;
                    item.text = priced.menuItemWithoutPrice;
                });    
            }
            catch (err) {
                menu = [{isError: true, text: err}];
            }
        }
        else {
            menu = new Array();
            if (error)
                menu.push({isError: true, text: error});
            if (response)
                menu.push({isError: true, text: "StatusCode: " + response.statusCode});
        }
        doneCallback(menu);
    });
}
