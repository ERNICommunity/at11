var request = require('request');
var cache = require('./cache');
var config = require('./config');

module.exports.fetchMenu = function (url, postParams, parseCallback, doneCallback) {
    var menuObj = cache.get(url);
    if (menuObj && !process.env.AT11_NO_CACHE)
    {
        doneCallback(menuObj);
    }
    else
    {
        load(url, postParams, parseCallback, function (menuObj) {
            if (menuObj.filter(function(item){ return !item.isError; }).length > 0)
            {
                cache.set(url, menuObj);
            }
            doneCallback(menuObj);
        });
    }
};

function load(url, postParams, parseCallback, doneCallback) {
    var options = {
        url: url,
        method: postParams ? "POST" : "GET",
        form: postParams
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200)
        {
            var timer = setTimeout(function () {
                timer = null;//clear needed as value is kept even after timeout fired
                doneCallback([{ isError: true, text: "Parser timeout", price: "" }]);
            }, config.parserTimeout);
            try
            {
                parseCallback(body, function (weekMenu) {
                    if (!timer)
                    {
                        return;//call must be ignored (multiple calls in parser or parser finishing after timeout/error)
                    }
                    clearTimeout(timer);
                    timer = null;//clearTimeout does not null the value

                    try
                    {
                        if (!Array.isArray(weekMenu))
                        {
                            throw "Invalid week menu returned (expected array, got " + typeof weekMenu + ")";
                        }
                        weekMenu.forEach(function(dailyMenu) {   
                            if (typeof dailyMenu.day !== "string")
                            {
                                throw "Daily menu has wrong 'day' property (" + typeof dailyMenu.day + ")";
                            }
                            if (!Array.isArray(dailyMenu.menu))
                            {
                                throw "Invalid daily menu returned (expected array, got " + typeof dailyMenu.menu + ")";
                            }
                            //check if each menu item has required attributes
                            dailyMenu.menu.forEach(function(item) {
                                if (typeof item !== "object")
                                {
                                    throw "Menu item should be object, but got " + typeof item;
                                }
                                if (typeof item.isSoup !== "boolean")
                                {
                                    throw "Menu item has wrong 'isSoup' flag (" + typeof item.isSoup + ")";
                                }
                                if (typeof item.text !== "string")
                                {
                                    throw "Menu item has wrong 'text' property (" + typeof item.text + ")";
                                }
                                if (typeof item.price !== "number")
                                {
                                    throw "Menu item has wrong 'price' property (" + typeof item.price + ")";
                                }
                                item.price = isNaN(item.price) ? "" : item.price.toFixed(2).replace(".", ",") + " €";//convert to presentable form
                            });
                        });
                        doneCallback(weekMenu);
                    }
                    catch(err)//catches callback errors
                    {
                        doneCallback([{ isError: true, text: err.toString(), price: "" }]);
                    }
                });
            }
            catch (err)//catches only synchronous errors
            {
                clearTimeout(timer);
                timer = null;//clearTimeout does not null the value
                doneCallback([{ isError: true, text: err.toString(), price: "" }]);
            }
        }
        else
        {
            doneCallback([{ isError: true, text: error && error.toString() || "", price: response && response.statusCode || "" }]);
        }
    });
}
