var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/obedovat'),
    testHelpers = require('../test/testHelpers');

moment.lang('sk');

describe('alfa', function () {
    describe('parsing sample 2014-05-26', function () {

        var html = fs.readFileSync(__dirname + '/samples/Alfa.2014-05-26.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-05-26"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 5 items", function () {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Fazulova s udenim");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Svieckova na smotane, knedla");
            assert.equal(menu[1].price, 3.60);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.trim(), "Bravc. medailonky-Peffer omacka, varene zemiaky");
            assert.equal(menu[2].price, 3.60);
        });

        it("4th item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Penne s kuracim masom a nivou");
            assert.equal(menu[3].price, 3.60);
        });

        it("5th item correct", function () {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.trim(), "Salat zo sunkou a vajcom, drezing toust");
            assert.equal(menu[4].price, 3.00);
        });
    });

    describe('parsing sample 2014-07-28', function () {

        var html = fs.readFileSync(__dirname + '/samples/Alfa.2014-07-28.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-07-28"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 6 items", function () {
            assert.equal(menu.length, 6);
        });

        it("should have two soups", function () {
            assert.equal(menu.filter(function (x) { return x.isSoup; }).length, 2);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Kulajda");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Mrkvova s hrskom");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.trim(), "Vyp. kuracia rolka s rokfordovouomackou, ryza");
            assert.equal(isNaN(menu[2].price), true);
        });

        it("4th item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Cevabcici, varene zemiaky, horcica, cibula");
            assert.equal(isNaN(menu[3].price), true);
        });

        it("5th item correct", function () {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.trim(), "Spenatove halusky so syrom");
            assert.equal(isNaN(menu[4].price), true);
        });

        it("6th item correct", function () {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text.trim(), "Pizza -5 druhov vyber");
            assert.equal(isNaN(menu[5].price), true);
        });
    });
});