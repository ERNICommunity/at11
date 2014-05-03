var urlModule = require('url');

module.exports.parsePrice = function(item) {
    var priceRegex = /([\d,.,,]*[\s]*)(€|Eur)/;
    var price = NaN;
    var text = item.replace(priceRegex, function(matchStr, group1, offset, originalStr){
        price = parseFloat(group1.replace(/\s/g, "").replace(",", "."));
        return "";
    });
    return {
        price: price,
        text: text
    };
};

global.String.prototype.removeDoubleWhitespace = function() {
    return this.replace(/\s\s+/g, ' ');
};

global.String.prototype.correctCommaSpacing = function() {
    return this.replace(/(\S) *(,|\.) *(\S)/g, '\$1\$2 \$3');
};

global.String.prototype.removeMetrics = function() {
    return this.replace(/\(?(\d*\/)*\d+ *,?\d+ *[lg]\)? */g, '');
};

global.String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/(^[A-Za-z\u00C0-\u017F])/, function(a) { return a.toUpperCase(); })
};

global.String.prototype.removeItemNumbering = function() {
    return this.replace(/^[\w\d][\)\.]+\s*/m, '');
};

module.exports.parseTheme = function(req) {
    var parsedUrl = urlModule.parse(req.url, true);
    var cookies = this.parseCookies(req);

    //if no parameter is defined in URL, use cookies (if any)
    if (!parsedUrl.query.theme && typeof(cookies.theme) != "undefined") {
        return cookies.theme;
    }

    //use parameter from URL or default if not defined
    return (parsedUrl.query && parsedUrl.query.theme) || "index";
};

module.exports.parseCookies = function(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
};
