import assert from "assert";
import fs from "fs";
import { describe, it } from "mocha";
import moment from "moment-timezone";

import { PizzaPazza } from "../parsers/pizzapazza";

moment.locale("sk");

describe("pizzapazza", () => {
    const parser = new PizzaPazza();

    describe("parsing sample 2018-01-19", () => {

        const html = fs.readFileSync("./test//samples/PizzaPazza.2018-01-19.html", { encoding: "utf-8" });
        let menu;

        before((done) => {
            parser.parse(html, moment("2018-01-19"), (menuItems) => {
                menu = menuItems;
                done();
            });
        });

        it("should return 3 items", () => {
            assert.equal(menu.length, 3);
        });

        it("1st item correct", () => {
            assert.equal(menu[0].isSoup, true, "It should be soup.");
            assert.equal(menu[0].text, "Rascová s vajíčkom");
            assert.equal(isNaN(menu[0].price), true, "It should not have price");
        });

        it("2rd item correct", () => {
            assert.equal(menu[1].isSoup, false, "It should not be soup.");
            assert.equal(menu[1].text, "Vyprážané rybie filé, slovenský zemiakový šalát");
            assert.equal(menu[1].price, 4.30);
        });

        it("3nd item correct", () => {
            assert.equal(menu[2].isSoup, false, "It should not be soup.");
            assert.equal(menu[2].text.trim(), "Hovädzí Stroganov, domáce halušky");
            assert.equal(menu[2].price, 4.80);
        });
    });
});
