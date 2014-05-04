var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment'),
    numerouno = require('../parsers/numerouno');

moment.lang('sk');

describe('numerouno', function() {
    describe('parsing sample 2014-04-29', function() {

        var html = fs.readFileSync(__dirname + '/samples/NumeroUno.2014-04-29.html', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            global.todaysDate = moment("2014-04-29");
            numerouno.parse(html, function(menuItems) {
                menu = menuItems;
                done();
            })
        });

        it("should return 5 items", function() {
            assert.equal(menu.length, 5);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Fazuľová polievka");
            assert.equal(isNaN(menu[0].price), true);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Lasagne bolognesse – zapekané cestoviny s boloňskou omáčkou a so syrom");
            assert.equal(menu[1].price, 3.90);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Bryndzové halušky so slaninkou a so smotanou");
            assert.equal(menu[2].price, 3.50);
        });
        
        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Chicken Salat – vyprážané kuracie kúsky v cornflexoch/ grilované kuracie kúsky na veľkom zeleninovom šaláte");
            assert.equal(menu[3].price, 4.90);
        });
        
        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "menu č. 4 po vypredaní menu č. 1 a 2 do 13:00 h: Vyprážaný syr s hranolkami, tatárska omáčka");
            assert.equal(menu[4].price, 4.50);
        });
    });

    describe('parsing sample 2014-05-02', function() {

        var html = fs.readFileSync(__dirname + '/samples/NumeroUno.2014-05-02.html', {encoding:"utf-8"});
        var menu;

        before(function(done) {
            global.todaysDate = moment("2014-05-02");
            numerouno.parse(html, function(menuItems) {
                menu = menuItems;
                done();
            })
        });

        it("should return 4 items", function() {
            assert.equal(menu.length, 4);
        });
        
        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Hovädzí vývar s haluškami");
            assert.equal(isNaN(menu[0].price), true);
        });
        
        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Vyprážaný kurací Cordon Bleu s opekanými zemiakmi, tatárska omáčka");
            assert.equal(menu[1].price, 3.90);
        });
        
        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Zeleninové rizoto so syrom, šalátik");
            assert.equal(menu[2].price, 3.50);
        });
        
        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "menu č. 4 po vypredaní menu č. 1 a 2 do 13:00 h: Vyprážaný syr s hranolkami, tatárska omáčka");
            assert.equal(menu[3].price, 4.50);
        });
    });
});