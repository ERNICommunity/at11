var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/numerouno'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('numerouno', function() {
    describe('parsing sample 2015-07-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/NumeroUno.2015-07-29.html', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2015-07-29"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 3 items", function() {
            assert.equal(menu.length, 3);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Brokolicová letná polievka");
            assert.equal(isNaN(menu[0].price), true);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Kuracie Kung Pao s ryžou");
            assert.equal(menu[1].price, 4.50);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Vyprážané šampiňóny s varenými zemiakmi, tatárska omáčka");
            assert.equal(menu[2].price, 4.00);
        });
    });
});