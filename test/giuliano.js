var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/giuliano');

moment.locale('sk');

describe('giuliano', function() {
    describe('parsing sample 2015-07-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/Giuliano.2015-07-29.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2015-07-29"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 2 items", function() {
            assert.equal(menu.length, 2);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Hovädzí vývar s krupicovinými haluškami");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Bravčové soté s čerstvou zeleninou, tekvicové placky");
            assert.equal(menu[1].price, 4.20);
        });
    });
});