var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/pizzapazza'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('pizzapazza', function() {
    describe('parsing sample 2014-07-14', function() {

        var html = fs.readFileSync(__dirname + '/samples/PizzaPazza.2014-07-14.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-07-14"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(2).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Zemiaková na kyslo");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Šunkovo-syrový špíz, pečené zemiaky, tatárska omáčka");
            assert.equal(menu[1].price, 4.00);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Sviečková na smotane, knedľa");
            assert.equal(menu[2].price, 4.80);
        });
    });
    describe('parsing sample 2014-10-07', function () {

        var html = fs.readFileSync(__dirname + '/samples/PizzaPazza.2014-10-07.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-10-07"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 3 items", function () {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Zeleninový vývar z čerstvej zeleniny");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Znojemské kuracie pečienky, ryža");
            assert.equal(menu[1].price, 4.00);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Pappardelle s parmezánovou omáčkou, prosciutto crudo, cherry paradajky");
            assert.equal(menu[2].price, 4.80);
        });
    });
});