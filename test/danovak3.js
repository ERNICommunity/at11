var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/danovak');

moment.locale('sk');

describe('danovak3', function () {
    describe('parsing sample 2017-01-10', function () {

        var html = fs.readFileSync(__dirname + '/samples/Danovak3.2017-01-10.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            parser.parse(html, moment("2017-01-10"), function (menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 7 items", function () {
            assert.equal(menu.length, 7);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text.trim(), "Hrášková s pečeňovými haluškami");
            assert(isNaN(menu[0].price));
        });

         it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Zemiaková na kyslo");
            assert(isNaN(menu[1].price));
        });

        it("3rd item correct", function () {
             assert.equal(menu[2].isSoup, false);
             assert.equal(menu[2].text.trim(), "Kurací steak s anglickou zeleninou, varené zemiaky");
             assert.equal(menu[2].price, 3.99);
        });
        
        it("4th item correct", function () {
             assert.equal(menu[3].isSoup, false);
             assert.equal(menu[3].text.trim(), "Kôprová omáčka s hovädzím mäskom a domácou parenou knedľou");
             assert.equal(menu[3].price, 3.99);
        });

        it("5th item correct", function () {
             assert.equal(menu[4].isSoup, false);
             assert.equal(menu[4].text.trim(), "Ryžový nákyp s bielkovým snehom a ovocným prelivom");
             assert.equal(menu[4].price, 3.99);
        });

        it("6th item correct", function () {
             assert.equal(menu[5].isSoup, false);
             assert.equal(menu[5].text.trim(), "Cestoviny Carbonara");
             assert.equal(menu[5].price, 3.99);
        });

        it("7th item correct", function () {
             assert.equal(menu[6].isSoup, false);
             assert.equal(menu[6].text.trim(), "Daňovákov burger(mleté mäso, šalátové listy, slaninka, syr, paradajka)BBQ om. hranolky, šalát");
             assert.equal(menu[6].price, 5.50);
        });
    });
});
