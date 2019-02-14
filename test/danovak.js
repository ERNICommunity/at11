var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/danovak');

moment.locale('sk');

describe('danovak_parser', function () {
    describe('parsing sample 2019-02-14', function () {
        var html = fs.readFileSync(__dirname + '/samples/Danovak.2019-02-14.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2019-02-14"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 9 items", function () {
            assert.equal(menu.length, 9);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true, "It should be soup.");
            assert.equal(menu[0].text, "Paradajková so syrom");
            assert.equal(isNaN(menu[0].price), true, "It should not have price");
        });

        it("Last item correct", function() {
            assert.equal(menu[8].isSoup, false, "It shouldn't be soup.");
            assert.equal(menu[8].text, "Losos na rozmaríne s holanskou omáčkou a citrónom, varené baby zemiaky, šalát");
            assert.equal(menu[8].price, 5.5);
        });
    });
    describe('parsing sample 2019-02-14 on Friday', function () {
        var html = fs.readFileSync(__dirname + '/samples/Danovak.2019-02-14.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2019-02-15"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 9 items", function () {
            assert.equal(menu.length, 9);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true, "It should be soup.");
            assert.equal(menu[0].text, "Hrachová s údeninou");
            assert.equal(isNaN(menu[0].price), true, "It should not have price");
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true, "It should be soup.");
            assert.equal(menu[1].text, "Fazuľová široké rezance");
            assert.equal(isNaN(menu[1].price), true, "It should not have price");
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false, "It shouldn't be soup.");
            assert.equal(menu[2].text, "Kurací steak s grilovanou cuketou na nivovej omáčke, americké zemiaky, šalát");
            assert.equal(menu[2].price, 3.8);
        });

        it("Last item correct", function() {
            assert.equal(menu[8].isSoup, false, "It shouldn't be soup.");
            assert.equal(menu[8].text, "Steak s bravčovej panenky na pfeffer omáčke a zelenej fazuľke, pečené zemiaky, uhorkový šalát");
            assert.equal(menu[8].price, 5.5);
        });
    });
});