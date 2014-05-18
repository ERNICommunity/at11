var config = require('./config');

module.exports = new (function() { // jshint ignore:line
	var values = [];

	this.set = function(key, value) {
        if(typeof value !== "object")
            throw "Only objects can be cached";
        value.cacheTime =  Date.now();
		values[key] = value;
	};

	this.get = function(key) {
		return isValid(key) ? values[key] : null;
	};

	function isValid(key) {
		var enterTime =  values[key] && values[key].cacheTime;
		return !!enterTime && (enterTime + config.cacheExpiration > Date.now());
	}

	this.clear = function() {
		values = [];
	};
})();