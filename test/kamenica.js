var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/kamenica');

moment.locale('sk');

describe('kamenica', function() {

    describe('parsing sample 2015-07-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/Kamenica.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2015-07-29"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Cesnaková krémová");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Fazuľová s klobásou");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kuracie prsia plnené so syrom a salámou, ryža");
            assert.equal(isNaN(menu[2].price), true);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Francúzske zemiaky, kyslá uhorka");
            assert.equal(isNaN(menu[3].price), true);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Vyprážaný karfiol, varené zemiaky, tatárska omáčka");
            assert.equal(isNaN(menu[4].price), true);
        });
    });
});
