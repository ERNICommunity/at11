var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/obedovat'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('danovak2', function () {
    describe('parsing sample 2014-12-06', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak2.2014-12-06.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-12-08"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function () {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Stareočeská kulajda");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Kurací vývar s mäsom a zeleninou");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.trim(), "Pečené kuracie stehná na rozmaríne, príloha");
            assert.equal(menu[2].price, 3.60);
        });

        it("4th item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Kuracie prsia na slivkách, príloha");
            assert.equal(menu[3].price, 3.60);
        });

        it("5th item correct", function () {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.trim(), "Bravčové karé v diabolskej omáčke, príloha");
            assert.equal(menu[4].price, 3.60);
        });

        it("6th item correct", function () {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text.trim(), "Vyprážaný černohor so syrom, príloha");
            assert.equal(menu[5].price, 3.60);
        });

        it("7th item correct", function () {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text.trim(), "Zeleninové rizoto, rukola, parmezán");
            assert.equal(menu[6].price, 3.60);
        });

        it("8th item correct", function () {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text.trim(), "Vyprážaná hliva, príloha");
            assert.equal(menu[7].price, 3.60);
        });
    });
});