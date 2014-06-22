var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/obedovat'),
    testHelpers = require('../test/testHelpers');

moment.lang('sk');

describe('alfa', function() {
    describe('parsing sample 2014-05-26', function() {

        var html = fs.readFileSync(__dirname + '/samples/Alfa.2014-05-26.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-05-26"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Fazulova s udenim");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Svieckova na smotane, knedla");
            assert.equal(menu[1].price, 3.60);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.trim(), "Bravc. medailonky-Peffer omacka, varene zemiaky");
            assert.equal(menu[2].price, 3.60);
        });
        
        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Penne s kuracim masom a nivou");
            assert.equal(menu[3].price, 3.60);
        });
        
        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.trim(), "Salat zo sunkou a vajcom, drezing toust");
            assert.equal(menu[4].price, 3.00);
        });
    });
});