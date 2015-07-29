var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/itb'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('itb', function() {
    describe('parsing sample 2015-29-07', function () {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2015-07-30"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(4).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 6 items", function () {
            assert.equal(menu.length, 6);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Richtárska");
            assert.equal(menu[0].price, 1);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text, "Hubová na kyslo");
            assert.equal(menu[1].price, 0.9);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Bravčové burritos v pšeničnej placke, mexická ryža");
            assert.equal(menu[2].price, 3.5);
        });

        it("4th item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Grilovaný hejk, fazuľové lúsky s mrkvou");
            assert.equal(menu[3].price, 3.3);
        });

        it("5th item correct", function () {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Maďarský hovädzí guláš, knedľa");
            assert.equal(menu[4].price, 3.5);
        });

        it("6th item correct", function () {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Grilovaná panenka, višňová omáčka, nové zemiaky so zeleninou");
            assert.equal(menu[5].price, 4.2);
        });
    });
});