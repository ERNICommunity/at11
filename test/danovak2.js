var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/zomato');

moment.locale('sk');

describe('danovak2', function () {
    describe('parsing sample 2015-07-29', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak2.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2015-07-29"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 8 items", function () {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text.trim(), "Špenátová krémová");
            assert(isNaN(menu[0].price));
         });

        it("2nd item correct", function () {
             assert.equal(menu[1].isSoup, true);
             assert.equal(menu[1].text.trim(), "Hrášková s údeninou");
             assert(isNaN(menu[1].price));
        });

        it("3rd item correct", function () {
          assert.equal(menu[2].isSoup, true);
          assert.equal(menu[2].text.trim(), "Domáci kurací vývar s niťovkami a zeleninou");
          assert(isNaN(menu[2].price));
        });

        it("4th item correct", function () {
             assert.equal(menu[3].isSoup, false);
             assert.equal(menu[3].text.trim(), "Vyprážaný kurací Gordon Blue, zemiakové pyré, kyslá uhorka");
             assert.equal(menu[3].price, 3.80);
        });

        it("5th item correct", function () {
             assert.equal(menu[4].isSoup, false);
             assert.equal(menu[4].text.trim(), "Pečené bravčové karé s kosťou špikované slaninkou a cibuľkou, varené zemiaky, kyslá uhorka");
             assert.equal(menu[4].price, 3.80);
        });

        it("6th item correct", function () {
             assert.equal(menu[5].isSoup, false);
             assert.equal(menu[5].text.trim(), "Penne 4 druhy syra so šampiňónmi a kuracinkou");
             assert.equal(menu[5].price, 3.80);
        });

        it("7th item correct", function () {
             assert.equal(menu[6].isSoup, false);
             assert.equal(menu[6].text.trim(), "Vyprážané kuracie krídelka v pikant obale, dusená ryža, kyslá uhorka");
             assert.equal(menu[6].price, 3.80);
        });

        it("8th item correct", function () {
             assert.equal(menu[7].isSoup, false);
             assert.equal(menu[7].text.trim(), "Dusená panenka na nivovej omáčke, 1/2 dusená ryža, 1/2 hrnolky, šalát alebo koláčik, kávička");
             assert.equal(menu[7].price, 5.50);
        });
    });
});
