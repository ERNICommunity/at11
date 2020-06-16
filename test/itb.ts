import assert from "assert";
import fs from "fs";
import { describe, it } from "mocha";
import moment from "moment-timezone";

import { Itb } from "../parsers/sevcenkova/itb";

moment.locale("sk");

describe("itb", () => {
    const parser = new Itb();

    describe("parsing sample 2015-29-07", () => {

        const html = fs.readFileSync("./test/samples/ITB.2015-07-29.html", { encoding: "utf-8" });
        let menu;

        before((done) => {
            parser.parse(html, moment("2015-07-30"), (menuItems) => {
                menu = menuItems;
                done();
            });
        });

        it("should return 8 items", () => {
            assert.equal(menu.length, 8);
        });

        it("1st item correct", () => {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Richtárska");
            assert.equal(menu[0].price, 1);
        });

        it("2nd item correct", () => {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text, "Hubová na kyslo");
            assert.equal(menu[1].price, 0.9);
        });

        it("3rd item correct", () => {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Grilovaná panenka, višňová omáčka, nové zemiaky so zeleninou");
            assert.equal(menu[2].price, 4.2);
        });

        it("4th item correct", () => {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Maďarský hovädzí guláš, knedľa");
            assert.equal(menu[3].price, 3.5);
        });

        it("5th item correct", () => {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Grilovaný hejk, fazuľové lúsky s mrkvou");
            assert.equal(menu[4].price, 3.3);
        });

        it("6th item correct", () => {
            assert.equal(menu[5].isSoup, false);
            assert.equal(menu[5].text, "Bravčové burritos v pšeničnej placke, mexická ryža");
            assert.equal(menu[5].price, 3.5);
        });

        it("7th item correct", () => {
            assert.equal(menu[6].isSoup, false);
            assert.equal(menu[6].text, "Černohorský morčací rezeň, pečené zemiaky");
            assert.equal(menu[6].price, 3.2);
        });

        it("8th item correct", () => {
            assert.equal(menu[7].isSoup, false);
            assert.equal(menu[7].text, "Perkelt z hlivy ústricovej, halušky");
            assert.equal(menu[7].price, 3.2);
        });
    });
});
