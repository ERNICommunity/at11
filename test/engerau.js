var assert = require('assert'),
    fs = require('fs'),
    parser = require('../parsers/engerau');

describe('engerau', function() {
    describe('parsing sample 2017-05-29', function() {

        var mockMenu = fs.readFileSync(__dirname + '/samples/Engerau.2017-05-29.txt', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            parser.parse(mockMenu, null, function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Slepačia polievka *1, 3,7, 9");
            assert.equal(menu[0].price, 3.99);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Zapekané kuracie prsia s ananásom a oštiepkom, ryža *1, 7");
            assert.equal(isNaN(menu[1].price), true);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Vyprážané bravčové kúsky marinované v pive, slovenský šalát *1, 3,7, 10");
            assert.equal(isNaN(menu[2].price), true);
        });

        it("4rd item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Zeleninový šalát s kuracími rezančekmi, mozzarellou, dresingom a krutónmi *1, 3,7, 10");
            assert.equal(isNaN(menu[3].price), true);
        });

        it("5rd item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "-Ohnivá bravčová panenka podávaná na vínovej omáčke s grilovanými baby zemiakmi *7, 9");
            assert.equal(menu[4].price, 8.9);
        });
    });
});