var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/itb'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('itb', function() {
    describe('parsing sample 2014-12-06', function() {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-12-06.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-12-08"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function() {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Rybacia");
            assert.equal(menu[0].price, 1.00);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text, "Šošovicová na kyslo");
            assert.equal(menu[1].price, 0.90);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.toUpperCase(), "VYPRÁŽANÁ ARGENTINSKÁ ŠŤUKA, ZEMIAKOVÝ ŠALÁT");
            assert.equal(menu[2].price, 4.20);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.toUpperCase(), "MARAKÉŠSKE KURACIE PRSIA, BRETÓNSKA ZELENINA");
            assert.equal(menu[3].price, 3.30);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.toUpperCase(), "GURMÁNSKE MORČACIE SOTÉ, DUSENÁ RYŽA");
            assert.equal(menu[4].price, 3.20);
        });
        
        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text.toUpperCase(), "PIEŠŤANSKÝ BRAVČOVÝ REZEŇ, HRANOLKY");
            assert.equal(menu[5].price, 3.20);
        });
        
        it("7th item correct", function() {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text.toUpperCase(), "HOVÄDZIA ROŠTENKA NA HUBÁCH, TARHOŇA");
            assert.equal(menu[6].price, 3.90);
        });
        
        it("8th item correct", function() {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text.toUpperCase(), "BRYNDZOVÉ HALUŠKY SO SLANINKOU");
            assert.equal(menu[7].price, 3.20);
        });
    });

    describe('parsing sample 2014-12-07', function () {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-12-06.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-12-08"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(2).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function () {
            assert.equal(menu.length, 8);
        });
    });
});