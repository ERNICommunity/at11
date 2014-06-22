var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/obedovat'),
    testHelpers = require('../test/testHelpers');

moment.lang('sk');

describe('albatros', function() {
    describe('parsing sample 2014-05-23', function() {

        var html = fs.readFileSync(__dirname + '/samples/Albatros.2014-05-23.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-05-23"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(5).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 6 items", function() {
            assert.equal(menu.length, 6);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Hovädzí vývar");
            assert.equal(menu[0].price, 1.10);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, false);
            assert.equal(menu[1].text.trim(), "Bravčový rezeň, zemiakový šalát");
            assert.equal(menu[1].price, 3.20);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kuracie stehno na smotane, cestovina");
            assert.equal(menu[2].price, 3.20);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Plnený kapustný list, zemiaková kaša");
            assert.equal(menu[3].price, 3.20);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Jedlá na objednávku (kurací Cordon bleu, vyprážaný kurací rezeň, syr)");
            assert.equal(menu[4].price, 3.20);
        });
        
        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Zeleninový tanier (tuniak, kuracie mäso, niva syr, balkánsky syr) + dresing");
            assert.equal(menu[5].price, 3.20);
        });
    });
});