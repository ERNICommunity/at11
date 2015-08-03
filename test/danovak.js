var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/zomato');

moment.locale('sk');

describe('danovak', function () {
    describe('parsing sample 2015-07-29', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2015-07-29"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 7 items", function () {
            assert.equal(menu.length, 7);
        });


        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text.trim(), "Kurací vývar so zeleninou, rezance");
            assert(isNaN(menu[0].price));
         });

        it("2nd item correct", function () {
             assert.equal(menu[1].isSoup, true);
             assert.equal(menu[1].text.trim(), "Šošovicová na kyslo");
             assert(isNaN(menu[1].price));
        });

        it("3rd item correct", function () {
             assert.equal(menu[2].isSoup, false);
             assert.equal(menu[2].text.trim(), "Kuracie prsia na nivovje omáčke dusená ryža, šalát");
             assert.equal(menu[2].price, 3.80);
        });

        it("4th item correct", function () {
             assert.equal(menu[3].isSoup, false);
             assert.equal(menu[3].text.trim(), "Španielský vtáčik, tarhoňa, šalát");
             assert.equal(menu[3].price, 3.80);
        });

        it("5th item correct", function () {
             assert.equal(menu[4].isSoup, false);
             assert.equal(menu[4].text.trim(), "Bryndzové halušky s domácou slaninkou a pažítkou");
             assert.equal(menu[4].price, 3.80);
        });

        it("6th item correct", function () {
             assert.equal(menu[5].isSoup, false);
             assert.equal(menu[5].text.trim(), "Grilovaný Encián s brusnicovou omáčkou, hranolky, šalát");
             assert.equal(menu[5].price, 3.80);
        });

        it("7th item correct", function () {
             assert.equal(menu[6].isSoup, false);
             assert.equal(menu[6].text.trim(), "Daňovákov burger, hranolky, BBQ omáčka");
             assert.equal(menu[6].price, 5.50);
        });
    });
    
    describe('parsing sample 2015-08-03', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak.2015-08-03.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2015-08-03"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 7 items", function () {
            assert.equal(menu.length, 7);
        });


        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text.trim(), "Maďarská gulášová");
            assert(isNaN(menu[0].price));
         });

        it("2nd item correct", function () {
             assert.equal(menu[1].isSoup, true);
             assert.equal(menu[1].text.trim(), "Kuracia so zeleninou, rezance");
             assert(isNaN(menu[1].price));
        });

        it("3rd item correct", function () {
             assert.equal(menu[2].isSoup, false);
             assert.equal(menu[2].text.trim(), "Kurací steak na grile s grilovanou zeleninou, ryža, šalát");
             assert.equal(menu[2].price, 3.80);
        });

        it("4th item correct", function () {
             assert.equal(menu[3].isSoup, false);
             assert.equal(menu[3].text.trim(), "Vyprážaný bravčový rezeň, slovenský šalát");
             assert.equal(menu[3].price, 3.80);
        });

        it("5th item correct", function () {
             assert.equal(menu[4].isSoup, false);
             assert.equal(menu[4].text.trim(), "Hubovo smotanové rizoto, rukola, parmezán, šalát");
             assert.equal(menu[4].price, 3.80);
        });

        it("6th item correct", function () {
             assert.equal(menu[5].isSoup, false);
             assert.equal(menu[5].text.trim(), "Moravský vrabec, dusená kapusta, parená knedľa");
             assert.equal(menu[5].price, 3.80);
        });

        it("7th item correct", function () {
             assert.equal(menu[6].isSoup, false);
             assert.equal(menu[6].text.trim(), "Pečené kura s domácou plnkou, dusená ryža, kompót");
             assert.equal(menu[6].price, 5.50);
        });
    });
});
