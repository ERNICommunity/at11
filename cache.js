module.exports = new (function() {
	var values = { };
	var expirations = { };
	var defulatTtl = 10 * 60 * 1000; // 10 min
	var now = function() { return Date.now(); };

	this.set = function(key, value, ttl) {		
		values[key] = value;
		expirations[key] = now() + (ttl || defulatTtl);
	};

	this.get = function(key) {
		return this.isValid(key) ? values[key] : null;
	};

	this.isValid = function(key) {
		var expiration =  expirations[key];		
		return !!expiration && (now() < expiration);
	};

	this.clear = function() {
		values = { };
		expiration = { };
	};

})();