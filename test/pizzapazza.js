var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    itb = require('../parsers/pizzapazza');

moment.lang('sk');

describe('pizzapazza', function() {
    describe('parsing sample 2014-05-13', function() {

        var html = fs.readFileSync(__dirname + '/samples/PizzaPazza.2014-05-13.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            global.todaysDate = moment("2014-05-13");
            itb.parse(html, function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Kurací vývar");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Vyprážaný syr, hranolky, tatárska omáčka");
            assert.equal(menu[1].price, 4.00);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kuracia kapsa plnená bryndzou a paprikou, burgundská omáčka, ryža");
            assert.equal(menu[2].price, 4.80);
        });
    });
    
    describe('parsing sample 2014-05-26', function() {

        var html = fs.readFileSync(__dirname + '/samples/PizzaPazza.2014-05-26.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            global.todaysDate = moment("2014-05-26");
            itb.parse(html, function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Zeleninová s haluškami");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Bolonské špagety");
            assert.equal(menu[1].price, 4.00);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Bravčové mexické soté v tortille, americký dressing");
            assert.equal(menu[2].price, 4.80);
        });
    });
});