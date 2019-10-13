"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var charset_1 = __importDefault(require("charset"));
var iconv = __importStar(require("iconv-lite"));
var request_1 = __importDefault(require("request"));
var MenuFetcher = /** @class */ (function () {
    function MenuFetcher(_config, _cache, _bypassCache) {
        this._config = _config;
        this._cache = _cache;
        this._bypassCache = _bypassCache;
    }
    MenuFetcher.prototype.fetchMenu = function (url, date, parseCallback, doneCallback) {
        var _this = this;
        var cached = this._cache.get(date + ":" + url);
        if (cached && !this._bypassCache) {
            doneCallback(null, cached);
        }
        else {
            this.load(url, date, parseCallback, function (error, menu) {
                if (!error) {
                    _this._cache.set(date + ":" + url, menu);
                    // we need to go through cache to get cache timestamp
                    doneCallback(null, _this._cache.get(date + ":" + url));
                }
                else {
                    console.error("Error for %s: %s", url, error);
                    doneCallback(error, null);
                }
            });
        }
    };
    MenuFetcher.prototype.load = function (url, date, parseCallback, doneCallback) {
        var _this = this;
        var options = {
            url: url,
            method: "GET",
            encoding: "binary",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept": "text/html,*/*"
            },
            timeout: 10 * 1000,
        };
        request_1.default(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var enc = charset_1.default(response.headers, body);
                if (enc !== "utf-8") {
                    body = iconv.decode(new Buffer(body, "binary"), enc);
                }
                var timer_1 = setTimeout(function () {
                    timer_1 = null; // clear needed as value is kept even after timeout fired
                    doneCallback(new Error("Parser timeout"), null);
                }, _this._config.parserTimeout);
                try {
                    parseCallback(body, date, function (menu) {
                        if (!timer_1) {
                            // multiple calls in parser or parser called after timeout
                            return;
                        }
                        clearTimeout(timer_1);
                        timer_1 = null;
                        doneCallback(null, menu);
                    });
                }
                catch (err) {
                    clearTimeout(timer_1);
                    timer_1 = null;
                    doneCallback(err, null);
                }
            }
            else {
                doneCallback(error || new Error("Response code " + response.statusCode), null);
            }
        });
    };
    return MenuFetcher;
}());
exports.MenuFetcher = MenuFetcher;
//# sourceMappingURL=menuFetcher.js.map