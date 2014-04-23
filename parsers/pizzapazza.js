var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var path = require('path');
var request = require('request');
var fs = require('fs');
var dv = require('dv');//ocr (tesseract)
process.env['TESSDATA_PREFIX'] = path.normalize(__dirname + "/..");

module.exports = new (function() {
	this.parse = function(html, doneCallback) {

		var $ = cheerio.load(html);

		var menu = new Array();

		var imgurl = $('div#content').find('img').first().attr('src');
        var extension = path.extname(imgurl);
        request({url : imgurl, encoding : null/*buffer the response*/}, function(error, response, buffer){
            if(error)
                throw error;
            var image = new dv.Image(extension.substring(1), buffer);
            var tesseract = new dv.Tesseract('slk', image);
            var menu = parseDaily(tesseract.findText('plain'));            
            doneCallback(menu);
        });

		function parseDaily(text) {
			var todayName = parserUtil.dayNameMap[global.todaysDate.getDay()];
            var stopSequence = global.todaysDate.getDay() === 5? "[sš]a[l/][aá]to.{2,3}\\s+menu" : parserUtil.dayNameMap[global.todaysDate.getDay()+1];
            var regex = new RegExp(todayName + "\\s+polievk.\\s*:\\s*(.+)\\n\\s+([\\s\\S]+)" + stopSequence, "i");
            var matches = regex.exec(text);
            
            var temp = [{isSoup: true, text: matches[1]}];
            var foods = matches[2].split("\n");
            for (var i = 0; i < foods.length ; i++) {
                var food = normalize(foods[i]);
                if(food !== "")
                    temp.push({isSoup: false, text: food});
            }
            return temp;
		}

		function normalize(str) {
			return str.trim()
				.replace(/\s\s+/g, ' ')
				.replace(/^\d\.\s*/, '');
		}
	};
})();