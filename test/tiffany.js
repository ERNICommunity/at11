var assert = require('assert'),
    fs = require('fs'),
    parser = require('../parsers/tiffany');

describe('tiffany', function() {
    describe('parsing sample 2017-05-29', function() {

        var mockMenu = fs.readFileSync(__dirname + '/samples/Tiffany.2017-05-29.txt', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            parser.parse(mockMenu, null, function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 6 items", function() {
            assert.equal(menu.length, 6);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Polievky : Špenátová (bezlepková), Syrová so šampiňónmi");
            assert.equal(isNaN(menu[0].price), true);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Zapekané kuracie prsia, opekané zemiaky");
            assert.equal(menu[1].price, 3.9);
        });

         it("3nd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text.trim(), "Lahodné bravčové rezne, ryža");
            assert.equal(menu[2].price, 3.9);
        });

        it("4nd item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text.trim(), "Vyprážaný syr, hranolky, tatarka");
            assert.equal(menu[3].price, 3.9);
        });

        it("5nd item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text.trim(), "Veg.jedlo: grilovaný falafel, opekané zemiaky, tzatziki");
            assert.equal(menu[4].price, 4.5);
        });

        it("6rd item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "DEZERT : tiramisu");
            assert.equal(isNaN(menu[5].price), true);
        });
    });
});