var cheerio = require('cheerio');

module.exports = new (function() {
    this.parse = function(html) {

        var $ = cheerio.load(html);

        var text = $('.menublock').children('div').eq(1).text();

        return text.match(/[^\r\n]+/g);
    };
})();
