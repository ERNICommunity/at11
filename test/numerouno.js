var assert = require("assert"),
    fs = require("fs"),
    moment = require("moment-timezone"),
    parser = require("../parsers/numerouno");

moment.locale("sk");

describe("numerouno", function() {
    describe("parsing sample 2015-07-29", function() {
        var html = fs.readFileSync(__dirname + "/samples/NumeroUno.2015-07-29.html", { encoding: "utf-8" });
        var menu;

        before(function(done) {
            parser.parse(html, moment("2015-07-29"), function(menuItems) {
                menu = menuItems;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Kelová polievka");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Kurací steak s bylinkovým maslom, zeleninová ryža, šalátik");
            assert.equal(menu[1].price, 4.5);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Slivkové gule so strúhankou preliatie horúcim maslom, cukor");
            assert.equal(menu[2].price, 4.0);
        });
    });
});
