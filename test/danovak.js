var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/zomato'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('danovak', function () {
    describe('parsing sample 2015-07-29', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak.2015-07-29.html', { encoding: "utf-8" });
        var menus, streda;

        before(function (done) {
            testHelpers.setWeekDates(moment("2015-07-29"));
            parser.parse(html, function (menuItems) {
                menus = menuItems;
                done();
            });
        });

        it("should return 3 items", function () {
            assert.equal(menus.length, 3);
        });

        it("should have streda as first day", function () {
          assert.equal(menus[0].day, "streda");
          streda = menus[0].menu;
        });

        it("1st item correct", function () {
            assert.equal(streda[0].isSoup, true);
            assert.equal(streda[0].text.trim(), "Kurací vývar so zeleninou, rezance");
            assert(isNaN(streda[0].price));
         });

        it("2nd item correct", function () {
             assert.equal(streda[1].isSoup, true);
             assert.equal(streda[1].text.trim(), "Šošovicová na kyslo");
             assert(isNaN(streda[1].price));
        });

        it("3rd item correct", function () {
             assert.equal(streda[2].isSoup, false);
             assert.equal(streda[2].text.trim(), "Kuracie prsia na nivovje omáčke dusená ryža, šalát");
             assert.equal(streda[2].price, 3.80);
        });

        it("4th item correct", function () {
             assert.equal(streda[3].isSoup, false);
             assert.equal(streda[3].text.trim(), "Španielský vtáčik, tarhoňa, šalát");
             assert.equal(streda[3].price, 3.80);
        });

        it("5th item correct", function () {
             assert.equal(streda[4].isSoup, false);
             assert.equal(streda[4].text.trim(), "Bryndzové halušky s domácou slaninkou a pažítkou");
             assert.equal(streda[4].price, 3.80);
        });

        it("6th item correct", function () {
             assert.equal(streda[5].isSoup, false);
             assert.equal(streda[5].text.trim(), "Grilovaný Encián s brusnicovou omáčkou, hranolky, šalát");
             assert.equal(streda[5].price, 3.80);
        });

        it("7th item correct", function () {
             assert.equal(streda[6].isSoup, false);
             assert.equal(streda[6].text.trim(), "Daňovákov burger, hranolky, BBQ omáčka");
             assert.equal(streda[6].price, 5.50);
        });
    });
});
