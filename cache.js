var config = require('./config');

module.exports = new (function() {
	var values = { };
	var expirations = { };
	var now = function() { return ; };

	this.set = function(key, value) {		
		values[key] = value;
		expirations[key] = Date.now() + config.cacheExpiration;
	};

	this.get = function(key) {
		return this.isValid(key) ? values[key] : null;
	};

	this.isValid = function(key) {
		var expiration =  expirations[key];		
		return !!expiration && (Date.now() < expiration);
	};

	this.clear = function() {
		values = { };
		expirations = { };
	};
})();