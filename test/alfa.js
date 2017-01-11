var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/alfa');

moment.locale('sk');

describe('alfa', function() {
    describe('parsing sample 2015-07-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/Alfa.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2015-07-29"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 7 items", function() {
            assert.equal(menu.length, 7);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true, "isSoup should be true");
            assert.equal(menu[0].text, "Hov. vyvar s pec. haluškami");
            assert.equal(isNaN(menu[0].price), true, "price should not exist");
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true, "isSoup should be true");
            assert.equal(menu[1].text.trim(), "Frankfurtská");
            assert.equal(isNaN(menu[1].price), true, "price should not exist");
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false, "isSoup should be false");
            assert.equal(menu[2].text, "Pečené kuracie stehno, ryža, kompót");
            assert.equal(isNaN(menu[2].price), false, "price should be there");
            assert.equal(menu[2].price, 3.8, "price is wrong");
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false, "isSoup should be false");
            assert.equal(menu[3].text, "Hovad. tokan na vine, tarhoňa");
            assert.equal(isNaN(menu[3].price), false, "price should be there");
            assert.equal(menu[3].price, 3.8, "price is wrong");
        });
    });

    describe('parsing sample 2017-01-11', function() {

        var html = fs.readFileSync(__dirname + '/samples/Alfa.2017-01-11.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2017-01-11"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 7 items", function() {
            assert.equal(menu.length, 7);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true, "isSoup should be true");
            assert.equal(menu[0].text, "Gulášová");
            assert.equal(isNaN(menu[0].price), true, "price should not exist");
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true, "isSoup should be true");
            assert.equal(menu[1].text.trim(), "Tekvicová");
            assert.equal(isNaN(menu[1].price), true, "price should not exist");
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false, "isSoup should be false");
            assert.equal(menu[2].text, "Vyprážaný kurací rezeň, zemiaková kaša, kap. šalát");
            assert.equal(isNaN(menu[2].price), false, "price should be there");
            assert.equal(menu[2].price, 3.8, "price is wrong");
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false, "isSoup should be false");
            assert.equal(menu[3].text, "Hovädzie varené chrenová omáčka, knedla");
            assert.equal(isNaN(menu[3].price), false, "price should be there");
            assert.equal(menu[3].price, 3.8, "price is wrong");
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false, "isSoup should be false");
            assert.equal(menu[4].text, "Bolonske špagety, parmezán");
            assert.equal(isNaN(menu[4].price), false, "price should be there");
            assert.equal(menu[4].price, 3.8, "price is wrong");
        });

        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false, "isSoup should be false");
            assert.equal(menu[5].text, "Kuracie na grile s anglickou zeleninou");
            assert.equal(isNaN(menu[5].price), false, "price should be there");
            assert.equal(menu[5].price, 3.8, "price is wrong");
        });

        it("7th item correct", function() {
            assert.equal(menu[6].isSoup, false, "isSoup should be false");
            assert.equal(menu[6].text, "Pizza tri druhy-Hawai, Fungi, Bacon");
            assert.equal(isNaN(menu[6].price), false, "price should be there");
            assert.equal(menu[6].price, 3.8, "price is wrong");
        });
    });
});
