var request = require('request');
var cache = require('./cache');
var parserUtil = require('./parsers/parserUtil.js');

module.exports = new (function () {
    this.fetchMenu = function (url, parseCallback, doneCallback) {
        var menuObj = cache.get(url);
        if (menuObj && !global.devMode)
            doneCallback(menuObj);
        else
            load(url, parseCallback, function (menuObj) {
                cache.set(url, menuObj);
                doneCallback(menuObj);
            });
    };
})();

function load(url, parseCallback, doneCallback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) 
        {
            try {
                var menuItems = parseCallback(body);

                if (!Array.isArray(menuItems))
                    throw "Invalid menu returned (expected array, got " + typeof menuItems + ")";

                //check if each menu item has required attributes
                menuItems.forEach(function(item){
                    if(typeof item !== "object")
                        throw "Each item should be object, but got " + typeof item;
                    if(typeof item.isSoup !== "boolean")
                        throw "Menu item has wrong 'isSoup' flag (" + typeof item.isSoup + ")";
                    if(typeof item.text !== "string")
                        throw "Menu item has wrong 'text' property (" + typeof item.text + ")";
                    if(typeof item.price !== "number")
                        throw "Menu item has wrong 'price' property (" + typeof item.price + ")";
                    item.price = isNaN(item.price) ? "" : item.price.toFixed(2).replace(".",",") + " €";//convert to presentable form
                });
                doneCallback(menuItems);
            }
            catch (err) {
                doneCallback([{isError: true, text: err}]);
            }
        }
        else 
        {
            var menu = new Array();
            if (error)
                menu.push({isError: true, text: error});
            if (response)
                menu.push({isError: true, text: "StatusCode: " + response.statusCode});
            doneCallback(menu);
        }
    });
}
