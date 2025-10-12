import assert from "assert";
import fs from "fs";
import { describe, it } from "mocha";

import { IMenuItem } from "../parsers/types";
import { PomodoroRosso } from "../parsers/einpark/pomodoro-rosso";

describe("PomodoroRosso", () => {
    const parser = new PomodoroRosso();

    describe("URL factory", () => {
        [
            "2025-03-17",
            "2025-03-18",
            "2025-03-19",
            "2025-03-20",
            "2025-03-21",
        ].forEach((date) => {
            it(`should return correct url for ${date}`, () => {
                const url = parser.urlFactory(new Date(date));
                assert.equal(
                    url,
                    "https://www.pizzeriapomodororosso.sk/2025/03/16/denne-menu-17-3-2025-21-3-2025/",
                );
            });
        });

        [
            "2025-03-10",
            "2025-03-11",
            "2025-03-12",
            "2025-03-13",
            "2025-03-14",
        ].forEach((date) => {
            it(`should return correct url for ${date}`, () => {
                const url = parser.urlFactory(new Date(date));
                assert.equal(
                    url,
                    "https://www.pizzeriapomodororosso.sk/2025/03/09/denne-menu-10-3-2025-14-3-2025/",
                );
            });
        });
    });

    describe("parsing sample 1", () => {
        const html = fs.readFileSync("./test/samples/pomodoro-rosso1.html", {
            encoding: "utf-8",
        });

        describe("menu for 'pondelok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 17))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Slepačí vývar s rezancami");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Kuracie prsia na prírodno, bylinková omáčka, ryža s kukuricou",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Zeleninové rizoto so syrom, mrkvový šalát",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Poľovnícky guláš z daniela, domáca karlovarská knedľa",
                );
                assert.equal(menu[3].price, 9.9);
            });
        });

        describe("menu for 'utorok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 18))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Zemiaková na kyslo");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Sviečková na smotane z bravčového karé, domáca knedľa",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(menu[2].text, "Špenátové lasagne s mozzarellou");
                assert.equal(isNaN(menu[2].price), true);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Poľovnícky guláš z daniela, domáca karlovarská knedľa",
                );
                assert.equal(menu[3].price, 9.9);
            });
        });

        describe("menu for 'streda'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 19))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Hŕstková");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Vyprážaný kurací rezeň, zemiaková kaša, miešaný šalát",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Zemiaková placka plnená bryndzou, smažená cibuľka",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Poľovnícky guláš z daniela, domáca karlovarská knedľa",
                );
                assert.equal(menu[3].price, 9.9);
            });
        });

        describe("menu for 'štvrtok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 20))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Šošovicová s párkom");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Bravčové ražniči, pečené zemiaky, čalamáda",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Lekvárové pirohy a šúľance s makom",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Poľovnícky guláš z daniela, domáca karlovarská knedľa",
                );
                assert.equal(menu[3].price, 9.9);
            });
        });

        describe("menu for 'piatok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 21))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Šampiňónová");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(menu[1].text, "Kurací gyros s ryžou, tzatziki");
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Hlivový perkelt, domáce maslové halušky",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Poľovnícky guláš z daniela, domáca karlovarská knedľa",
                );
                assert.equal(menu[3].price, 9.9);
            });
        });
    });

    describe("parsing sample 2", () => {
        const html = fs.readFileSync("./test/samples/pomodoro-rosso2.html", {
            encoding: "utf-8",
        });

        describe("menu for 'pondelok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 10))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Slepačí vývar s rezancami");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Kuracie rezance na čerstvej zelenine, jasmínová ryža",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(menu[2].text, "Linguine Arabiatta");
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Filé z tresky v trojobale, zemiakový majonezový šalát",
                );
                assert.equal(menu[3].price, 8.9);
            });
        });

        describe("menu for 'utorok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 11))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Šošovicová so zeleninou");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Rezníky z bravčovej panenky, zemiaková kaša, kyslá uhorka",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Domáce pečené buchty plnené slivkovým lekvárom a makom",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Filé z tresky v trojobale, zemiakový majonezový šalát",
                );
                assert.equal(menu[3].price, 8.9);
            });
        });

        describe("menu for 'streda'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 12))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(
                    menu[0].text,
                    "Zeleninová s krupicovými haluškami",
                );
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Zapečený kurací steak so sušenými paradajkami a mozzarellou, tarhoňa",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Vyprážané tofu v zemiakovom cestičku, zemiaková kaša, miešaný listový šalát",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Filé z tresky v trojobale, zemiakový majonezový šalát",
                );
                assert.equal(menu[3].price, 8.9);
            });
        });

        describe("menu for 'štvrtok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 13))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Brokolicý krém");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Pečená kuracia 1/4, ryža, cherry šalát",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Parmezánové krémové rizoto so špenátom",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Filé z tresky v trojobale, zemiakový majonezový šalát",
                );
                assert.equal(menu[3].price, 8.9);
            });
        });

        describe("menu for 'štvrtok'", () => {
            let menu: IMenuItem[];

            before(() => {
                return parser
                    .parse(html, new Date(2025, 2, 14))
                    .then((menuItems) => {
                        menu = menuItems;
                    });
            });

            it("should return correct number of items", () => {
                assert.equal(menu.length, 4);
            });

            it("1st item correct", () => {
                assert.equal(menu[0].isSoup, true);
                assert.equal(menu[0].text, "Držková s rozhlíkom");
                assert.equal(isNaN(menu[0].price), true);
            });

            it("2nd item correct", () => {
                assert.equal(menu[1].isSoup, false);
                assert.equal(
                    menu[1].text,
                    "Živánska v alobale, opekané zemiaky, kapustový šalát",
                );
                assert.equal(menu[1].price, 7.9);
            });

            it("3rd item correct", () => {
                assert.equal(menu[2].isSoup, false);
                assert.equal(
                    menu[2].text,
                    "Vyprážaná cuketa v cestíčku, zemiaková kaša, bylinkový dressing",
                );
                assert.equal(menu[2].price, 7.9);
            });

            it("4th item correct", () => {
                assert.equal(menu[3].isSoup, false);
                assert.equal(
                    menu[3].text,
                    "Filé z tresky v trojobale, zemiakový majonezový šalát",
                );
                assert.equal(menu[3].price, 8.9);
            });
        });
    });
});
