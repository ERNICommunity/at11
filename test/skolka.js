var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/skolka');

moment.locale('sk');

describe('skolka', function() {
    describe('parsing sample 2014-06-02', function() {

        var html = fs.readFileSync(__dirname + '/samples/Skolka.2014-06-02.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2014-06-02"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Rajčinová polievka");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Kuracie prsia s nivovou omáčkou, ryža");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Domáce buchty plnené džemom");
            assert.equal(isNaN(menu[2].price), true);
        });
    });
});