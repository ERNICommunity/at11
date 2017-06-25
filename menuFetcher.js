var request = require("request");
var cache = require("./cache");
var config = require("./config");
var charset = require("charset");
var iconv = require("iconv-lite");

module.exports.fetchMenu = function(url, date, postParams, parseCallback, doneCallback) {
    var cached = cache.get(date + ":" + url);
    if (cached && !process.env.AT11_NO_CACHE) {
        doneCallback(null, cached);
    } else {
        load(url, date, postParams, parseCallback, function(error, menu) {
            if (!error) {
                if (menu.length > 0) {
                    cache.set(date + ":" + url, menu);
                }
                //we need to go through cache to get cache timestamp
                doneCallback(null, cache.get(date + ":" + url));
            } else {
                console.error("Error for %s: %s", url, error);
                doneCallback(error);
            }
        });
    }

    function load(url, date, postParams, parse, done) {
        var options = {
            url: url,
            method: postParams ? "POST" : "GET",
            form: postParams,
            encoding: "binary",
            timeout: 10 * 1000 // 10s timeout for request
        };
        request(options, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var enc = charset(response.headers, body);
                if (enc !== "utf-8") {
                    body = iconv.decode(new Buffer(body, "binary"), enc).toString("utf-8");
                }

                var timer = setTimeout(function() {
                    timer = null; //clear needed as value is kept even after timeout fired
                    done(new Error("Parser timeout"));
                }, config.parserTimeout);

                try {
                    parse(body, date, function(menu) {
                        if (!timer) {
                            //multiple calls in parser or parser called after timeout
                            return;
                        }
                        clearTimeout(timer);
                        timer = null; //clearTimeout does not null the value

                        try {
                            if (!Array.isArray(menu)) {
                                throw "Invalid menu returned (expected array, got " + typeof menu + ")";
                            }
                            menu.forEach(function(item) {
                                if (typeof item !== "object") {
                                    throw "Menu item should be object, but got " + typeof item;
                                }
                                if (typeof item.isSoup !== "boolean") {
                                    throw "Menu item has wrong 'isSoup' flag (" + typeof item.isSoup + ")";
                                }
                                if (typeof item.text !== "string") {
                                    throw "Menu item has wrong 'text' property (" + typeof item.text + ")";
                                }
                                if (typeof item.price !== "number") {
                                    throw "Menu item has wrong 'price' property (" + typeof item.price + ")";
                                }
                                item.price = isNaN(item.price) ? "" : item.price.toFixed(2).replace(".", ",") + " €"; //convert to presentable form
                            });
                            done(null, menu);
                        } catch (err) {
                            done(err);
                        }
                    });
                } catch (err) { //catches only synchronous errors in parser code
                    clearTimeout(timer);
                    doneCallback(err);
                }
            } else {
                doneCallback(error || new Error("Response code " + response.statusCode));
            }
        });
    }
};
