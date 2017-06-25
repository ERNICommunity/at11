var assert = require("assert"),
    moment = require("moment-timezone");

describe("Moment", function() {
    describe("Should be the same day", function() {
        var m = moment().tz("Europe/Bratislava");

        it(m.toString(), function() {
            assert.equal(m.format("dddd"), moment(Date.now()).tz("Europe/Bratislava").format("dddd"));
        });
    });
});
