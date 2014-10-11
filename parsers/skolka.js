var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');
var fs = require('fs');
var pdf2png = require('pdf2png');

module.exports.parse = function (html, callback) {

    var $ = cheerio.load(html);

    var weekMenu = [];

    var pic = $('.entry-content img');
    var action = "";

    if (pic.length === 0) {
        var link = $('.entry-content a').filter(function () {
            return $(this).text() !== '' && !/<a/.test($(this).html());
        });

        var pdfUrl = link.attr('href');

        fs.exists(__dirname + "/../temp", function (exists) {
            if (!exists) {
                fs.mkdirSync(__dirname + "/../temp");
            }
            request(pdfUrl).pipe(fs.createWriteStream(__dirname + '/../temp/menu.pdf').on('finish', function () {
                pdf2png.convert(__dirname + "/../temp/menu.pdf", function (resp) {
                    if (!resp.success) {
                        callback(weekMenu);
                    }

                    fs.writeFile(__dirname + "/../temp/menu.png", resp.data, function (err) {
                        if (err) {
                            callback(weekMenu);
                        }
                        else {
                            fs.readFile(__dirname + "/../temp/menu.png", function (error, data) {
                                var encoded = data.toString('base64');
                                callOcr(encoded, 'encoded');
                            });
                        }
                    });
                });
            }));
        });
    }
    else if (pic.parent().filter("a").length > 0) {
        pic = pic.parent().attr('href');
        action = "url";
    }
    else if (pic.attr('src') !== undefined) {
        pic = pic.attr('src');
        action = "encoded";
    }

    if (pic && pic.length !== 0) {
        callOcr(pic, action);
    }
    else if (!pic) {
        parseMenu($('div.entry-content', '#post-2').text());
    }

    function callOcr(picData, actionMetod) {
        request.post({
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            url: 'http://at11ocr.azurewebsites.net/api/process/' + actionMetod,
            body: "=" + encodeURIComponent(picData)
        }, function (error, response, body) {
            if (!error) {
                parseMenu(body);
            }
            callback(weekMenu);
        });
    }

    function parseMenu(menuString) {
        var lines = menuString.split("\n").filter(function (val) {
            return val.trim();
        });
        global.dates.forEach(function (date) {
            var dayMenu = [];
            var dateReg = new RegExp("^\\s*0?" + date.date() + "\\.\\s*0?" + (date.month() + 1) + "\\.\\s*" + date.year());
            var todayNameReg = new RegExp("^\\s*" + date.format("dddd"), "i");
            var price;
            for (var i = 0; i < lines.length; i++) {
                if (todayNameReg.test(lines[i])) {
                    for (var offset = 0; offset < 3; offset++)//3 menu lines each day
                    {
                        var txt = lines[i + offset];
                        if (offset === 0)
                            txt = txt.replace(todayNameReg, "");
                        if (offset === 1)
                            txt = txt.replace(dateReg, "");
                        txt = normalize(txt);
                        if (txt)
                            dayMenu.push(txt);
                    }
                }
                if (/menu/.test(lines[i]))
                    price = parserUtil.parsePrice(lines[i]).price;
                else
                    price = price || NaN;
            }

            //convert to menu item object
            dayMenu = dayMenu.map(function (item, index) {
                return { isSoup: /polievka/i.test(item), text: item, price: index === 0 ? NaN : price };
            });

            weekMenu.push({ day: date.format('dddd'), menu: dayMenu });
        });

        callback(weekMenu);
    }

    function normalize(str) {
        return str.tidyAfterOCR()
                .removeItemNumbering()
                .removeMetrics()
                .normalizeWhitespace()
                .correctCommaSpacing();
    }
};