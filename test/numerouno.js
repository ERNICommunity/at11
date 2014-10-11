var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/numerouno'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('numerouno', function() {
    describe('parsing sample 2014-06-02', function() {

        var html = fs.readFileSync(__dirname + '/samples/NumeroUno.2014-06-02.html', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-06-02"));
            global.todaysDate = moment("2014-06-02");
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 4 items", function() {
            assert.equal(menu.length, 4);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Šošovicová polievka");
            assert.equal(isNaN(menu[0].price), true);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Grilovaný bravčový steak s volským okom, ½ ryža, ½ hranolky");
            assert.equal(menu[1].price, 3.90);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Sphagetti Aglio Olio – špagety s čili papričkami na olivovom oleji, bylinky");
            assert.equal(menu[2].price, 3.50);
        });
        
        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Chicken salat – veľký miešaný šalát s vyprážanými kuracími tyčinkami v sézame");
            assert.equal(menu[3].price, 5.50);
        });
    });
});