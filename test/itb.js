var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    itb = require('../parsers/itb');

moment.lang('sk');

describe('itb', function() {
    describe('parsing sample 2014-05-05', function() {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-05-05.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            global.todaysDate = moment("2014-05-05");
            itb.parse(html, function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 8 items", function() {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Hrachová");
            assert.equal(menu[0].price, 0.90);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Karfiólová");
            assert.equal(menu[1].price, 0.90);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Grilovaná panenka, omáčka z lesných kuriatok, pečené zemiaky");
            assert.equal(menu[2].price, 4.20);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Bbq kuracie prsia, brokolica+karfiol");
            assert.equal(menu[3].price, 3.30);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Španielska hovadzia pochútka, tarhoňa");
            assert.equal(menu[4].price, 3.50);
        });
        
        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Pastierský kurací rezeň, opekané zemiaky");
            assert.equal(menu[5].price, 3.20);
        });
        
        it("7th item correct", function() {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text, "Bravčové medajlónky, šalviová omáčkou, ryźa");
            assert.equal(menu[6].price, 3.20);
        });
        
        it("8th item correct", function() {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text, "Zelené natur rizoto");
            assert.equal(menu[7].price, 3.20);
        });
    });
});