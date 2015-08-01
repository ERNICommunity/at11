var config = require('./config');

module.exports = new (function() { // jshint ignore:line
	var cache = {};

	this.set = function(key, value) {
        if(typeof value !== "object")
        {
            throw "Only objects can be cached";
        }
		cache[key] = { value: value, timestamp: Date.now() };
	};

	this.get = function(key) {
		return isValid(key) ? cache[key] : null;
	};

	function isValid(key) {
		var enterTime = cache[key] && cache[key].timestamp;
		return !!enterTime && (enterTime + config.cacheExpiration > Date.now());
	}

	this.clear = function() {
		cache = {};
	};
})();
