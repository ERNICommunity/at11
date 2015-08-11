var config = require('./config');

module.exports = new (function() { // jshint ignore:line
	var cache = {};
    setInterval(cleanUp, config.cacheExpiration);

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

	function cleanUp() {
		for(var key in cache){
            if(cache.hasOwnProperty(key) && !isValid(key)){
                delete cache[key];
            }
        }
	}
})();
