import assert from "assert";
import { describe, it } from "mocha";
import "../parsers/parserUtil";
import { parsePrice } from "../parsers/parserUtil";

const parsePriceTests = [
    { input: "Hodnota stravy: 3,50 Eur", result: { price: 3.5, text: "Hodnota stravy:" } },
    { input: "text 3,50 € text", result: { price: 3.5, text: "text  text" } },
    { input: "text text 3,50, Eur", result: { price: 3.5, text: "text text" } },
    { input: "text3.50 € text", result: { price: 3.5, text: "text text" } },
    { input: "text 3.50 Eur text", result: { price: 3.5, text: "text  text" } },
    { input: "text 3.50EUR text", result: { price: 3.5, text: "text  text" } },
    { input: "text3,50. € text", result: { price: 3.5, text: "text text" } },
    { input: "text 3.50     € text", result: { price: 3.5, text: "text  text" } },
    { input: "text 123.45€ text", result: { price: 123.45, text: "text  text" } },
    { input: "text 5€ text", result: { price: 5, text: "text  text" } },
    { input: "text 5 Eur text", result: { price: 5, text: "text  text" } },
    { input: "text 5. euR text", result: { price: 5, text: "text  text" } },
    { input: "text 3.50   eur text", result: { price: 3.5, text: "text  text" } },
    { input: "text 1eur3.50 text", result: { price: 1, text: "text 3.50 text" } }
];

const ocrCleanup = [
    { input: "texta' textl`", result: "textá textľ" },
    { input: "pri'prava môže trvat' 10 minu't", result: "príprava môže trvať 10 minút" },
    { input: "hlavne' jedlo", result: "hlavné jedlo" },
    { input: "duseny` po`r", result: "dusený pór" }
];

describe("Parser Utils", () => {

    describe("Parse price", () => {
        parsePriceTests.forEach((item) => {
            it(item.input, () => {
                const priced = parsePrice(item.input);
                assert.deepEqual(priced, item.result);
            });
        });
    });

    describe("OCR cleanup", () => {
        ocrCleanup.forEach((item) => {
            it(item.input, () => {
                assert.equal(item.input.tidyAfterOCR(), item.result);
            });
        });
    });
});
