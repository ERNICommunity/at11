var assert = require('assert'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    parser = require('../parsers/itb'),
    testHelpers = require('../test/testHelpers');

moment.locale('sk');

describe('itb', function() {
    describe('parsing sample 2014-05-05', function() {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-05-05.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-05-05"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
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
    
    describe('parsing sample 2014-06-02', function() {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-06-02.html', { encoding: "utf-8" });
        var menu;

        before(function(done) {
            testHelpers.setWeekDates(moment("2014-06-02"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function(x) { if(x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function() {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Šošovicová");
            assert.equal(menu[0].price, 0.90);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Hlivová");
            assert.equal(menu[1].price, 0.90);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Čínsky kurací wok z ryžovými rezancami, morskými rybami a zeleninou");
            assert.equal(menu[2].price, 4.20);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Kuracie prsia na koriandri, lahôdková zelenina");
            assert.equal(menu[3].price, 3.30);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Koprová omáčka, hovadzie zadné, knedľa");
            assert.equal(menu[4].price, 3.50);
        });
        
        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Morčacie prsia s listovým špenátom, ryža");
            assert.equal(menu[5].price, 3.20);
        });
        
        it("7th item correct", function() {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text, "Bravčový rezeň palermo, pomodoro dip, zemiaková kaša");
            assert.equal(menu[6].price, 3.20);
        });
        
        it("8th item correct", function() {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text, "Vyprážaný syr, hranolky");
            assert.equal(menu[7].price, 3.20);
        });
    });
    
    describe('parsing sample 2014-06-11', function() {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-06-11.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-06-11"));
            parser.parse(html, function(menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(3).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function() {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function() {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Slepačia");
            assert.equal(menu[0].price, 1.00);
        });

        it("2nd item correct", function() {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Mrkvová");
            assert.equal(menu[1].price, 0.90);
        });

        it("3rd item correct", function() {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Grilované kurača, pečené zemiaky so zeleninou");
            assert.equal(menu[2].price, 4.50);
        });

        it("4th item correct", function() {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Pečený haik, pečená tekvica s brokolicou");
            assert.equal(menu[3].price, 3.30);
        });

        it("5th item correct", function() {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Vyprážané rybie filé, zemiaková kaša");
            assert.equal(menu[4].price, 3.20);
        });
        
        it("6th item correct", function() {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Morčacie medajlónky na šafráne, dusená ryža");
            assert.equal(menu[5].price, 3.20);
        });
        
        it("7th item correct", function() {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text, "Jelenie ragú so šampiňónmi, halušky");
            assert.equal(menu[6].price, 3.50);
        });
        
        it("8th item correct", function() {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text, "Pečené huby na tymiane, zemiaková kaša");
            assert.equal(menu[7].price, 3.20);
        });
    });
    
    describe('parsing sample 2014-10-07', function () {

        var html = fs.readFileSync(__dirname + '/samples/ITB.2014-10-07.html', { encoding: "utf-8" });
        var menu;

        before(function (done) {
            testHelpers.setWeekDates(moment("2014-10-07"));
            parser.parse(html, function (menuItems) {
                menu = menuItems.filter(function (x) { if (x.day == moment().day(1).format('dddd')) return true; })[0].menu;
                done();
            });
        });

        it("should return 8 items", function () {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", function () {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Šošovicová s párkom");
            assert.equal(menu[0].price, 0.90);
        });

        it("2nd item correct", function () {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Hlivová");
            assert.equal(menu[1].price, 0.90);
        });

        it("3rd item correct", function () {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kurací steak, tzatziky, pečené zemiaky");
            assert.equal(menu[2].price, 4.20);
        });

        it("4th item correct", function () {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Pečený hejk, bretónska zelenina");
            assert.equal(menu[3].price, 3.30);
        });

        it("5th item correct", function () {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Koprová omáčka, hovadzie zadné, knedľa");
            assert.equal(menu[4].price, 3.50);
        });

        it("6th item correct", function () {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Morčacie prsia s listovým špenátom, ryža");
            assert.equal(menu[5].price, 3.20);
        });

        it("7th item correct", function () {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text, "Bravčový rezeň palermo, pomodoro dip, zemiaková kaša");
            assert.equal(menu[6].price, 3.20);
        });

        it("8th item correct", function () {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text, "Vyprážaný syr, hranolky");
            assert.equal(menu[7].price, 3.20);
        });
    });
});