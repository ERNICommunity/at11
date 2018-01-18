var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/danovak');

moment.locale('sk');

describe('danovak_parser', function () {
    describe('parsing sample 2018-01-18', function () {
        var html = fs.readFileSync(__dirname + '/samples/Danovak.2018-01-18.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2018-01-19"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 9 items", function () {
            assert.equal(menu.length, 9);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text.trim(), "Slepačí vývar");
            assert(isNaN(menu[0].price));
         });
    });

    describe('parsing sample 2018-01-22', function () {
        var html = fs.readFileSync(__dirname + '/samples/Danovak.2018-01-18.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2018-01-22"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 9 items", function () {
            assert.equal(menu.length, 9);
        });

        it("1st item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Kurací rezeň v cestíčku plnený šunkou, syrom a broskyňou, ryža, šalát");
            assert.equal(menu[3].price, 4.39);
         });
    });
});