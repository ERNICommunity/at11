var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/giuliano'),
    testHelpers = require('../test/testHelpers');

moment.lang('sk');

describe('giuliano', function() {
    describe('parsing sample 2014-05-26', function() {

        var html = fs.readFileSync(__dirname + '/samples/Giuliano.2014-05-26.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-05-26"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 2 items", function() {
            assert.equal(menu.length, 2);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Tekvicová krémová polievka s tekvicovým olejom");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Šalátový tanier s restovanou kuracou pečeňou, ľanový osúch");
            assert.equal(menu[1].price, 4.20);
        });
    });
});