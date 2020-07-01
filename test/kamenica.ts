import assert from "assert";
import fs from "fs";
import { describe, it } from "mocha";

import { Kamenica } from "../parsers/sevcenkova/kamenica";
import { IMenuItem } from "../parsers/IMenuItem";

describe("kamenica", () => {
    const parser = new Kamenica();

    describe("parsing sample 2015-07-29", () => {

        const html = fs.readFileSync("./test//samples/Kamenica.2015-07-29.html", { encoding: "utf-8" });
        let menu: IMenuItem[];

        before((done) => {
            parser.parse(html, new Date(2015, 6, 29))
                .then((menuItems) => {
                    menu = menuItems;
                    done();
                });
        });

        it("should return 5 items", () => {
            assert.equal(menu.length, 5);
        });

        it("1st item correct", () => {
            assert.equal(menu[0].isSoup, true);
            assert.equal(menu[0].text, "Cesnaková krémová");
            assert.equal(isNaN(menu[0].price), true);
        });

        it("2nd item correct", () => {
            assert.equal(menu[1].isSoup, true);
            assert.equal(menu[1].text.trim(), "Fazuľová s klobásou");
            assert.equal(isNaN(menu[1].price), true);
        });

        it("3rd item correct", () => {
            assert.equal(menu[2].isSoup, false);
            assert.equal(menu[2].text, "Kuracie prsia plnené so syrom a salámou, ryža");
            assert.equal(menu[2].price, 3.99);
        });

        it("4th item correct", () => {
            assert.equal(menu[3].isSoup, false);
            assert.equal(menu[3].text, "Francúzske zemiaky, kyslá uhorka");
            assert.equal(menu[3].price, 3.99);
        });

        it("5th item correct", () => {
            assert.equal(menu[4].isSoup, false);
            assert.equal(menu[4].text, "Vyprážaný karfiol, varené zemiaky, tatárska omáčka");
            assert.equal(menu[4].price, 3.99);
        });
    });
});
