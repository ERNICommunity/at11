"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cache = /** @class */ (function () {
    function Cache(_config) {
        this._config = _config;
        this._store = {};
        setInterval(this.cleanUp, this._config.cacheExpiration);
    }
    Cache.prototype.set = function (key, value) {
        this._store[key] = { value: value, timestamp: Date.now() };
    };
    Cache.prototype.get = function (key) {
        return this.isValid(key) ? this._store[key] : null;
    };
    Cache.prototype.isValid = function (key) {
        var enterTime = this._store[key] && this._store[key].timestamp;
        return !!enterTime && (enterTime + this._config.cacheExpiration > Date.now());
    };
    Cache.prototype.cleanUp = function () {
        for (var key in this._store) {
            if (this._store[key] && !this.isValid(key)) {
                delete this._store[key];
            }
        }
    };
    return Cache;
}());
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map