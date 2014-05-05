var assert = require('assert'),
    parserUtil = require('../parsers/parserUtil');

var parsePriceTests = [
    { input: "Hodnota stravy: 3,50 Eur", result: { price: 3.5, text: "Hodnota stravy: " } },
    { input: "text 3,50 € text", result: { price: 3.5, text: "text  text" } },
    { input: "text text 3,50, Eur", result: { price: 3.5, text: "text text " } },
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

describe('Parse price', function() {
        parsePriceTests.forEach(function(item) {
            it(item.input, function() {
                var priced = parserUtil.parsePrice(item.input);
                assert.deepEqual(priced, item.result);
            });
        }
        );
    });