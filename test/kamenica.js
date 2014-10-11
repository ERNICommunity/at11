var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/sme'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('kamenica', function() {
    describe('parsing sample 2014-04-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/Kamenica.2014-04-29.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-04-29"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(2).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Zeleninová");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Šampiňónová krémová");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Zapekané kuracie prsia s broskyňou a syrom, ryža");
            assert.equal(isNaN(menu[2].price), true);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Pečené pliecko, kapusta, knedľa");
            assert.equal(isNaN(menu[3].price), true);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Makové šúľance");
            assert.equal(isNaN(menu[4].price), true);
        });
    });
    
    describe('parsing sample 2014-05-14', function() {

        var html = fs.readFileSync(__dirname + '/samples/Kamenica.2014-05-14.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-05-14"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(3).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Zemiaková kyslá");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Paradajková");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kurací gyros, ½ ryža ½ hranolky");
            assert.equal(isNaN(menu[2].price), true);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Vyprážaný bravčový rezeň, zemiaková kaša, kyslá uhorka");
            assert.equal(isNaN(menu[3].price), true);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Grilovaná zelenina, varené zemiaky, cesnakový dressing 300");
            assert.equal(isNaN(menu[4].price), true);
        });
    });
});