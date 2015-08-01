var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/pizzapazza'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('pizzapazza', function() {
    describe('parsing sample 2015-08-01', function() {

        var html = fs.readFileSync(__dirname + '/samples/PizzaPazza.2015-08-01.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2015-08-01"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Talianska cícerová");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Penne Polo e Funghi - cestoviny so šampiňónmi, kuracím mäsom a parmezánom");
            assert.equal(menu[1].price, 4.00);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Obrátený bravčový rezeň, ryža");
            assert.equal(menu[2].price, 4.80);
        });
    });
});