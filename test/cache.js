var assert = require("assert"),
    cache = require("../cache.js");

describe("cache", function() {
    describe("set", function() {
        it("should exists", function() {
            assert(cache.set);
        });

        it("should not throw exception", function() {
            assert.doesNotThrow(function() {
                cache.set("abc", {});
            });
        });
    });

    describe("get", function() {
        it("should exists", function() {
            assert(cache.get);
        });

        it("should not found what wasn't stored", function() {
            assert(!cache.get("xyz"));
        });

        it("should found what was stored", function() {
            var value = { prop: "value" };
            cache.set("obj", value);
            assert.strictEqual(cache.get("obj").value, value);
        });

        it("should expire", function(done) {
            var config = require("../config");
            config.cacheExpiration = 1; //set expiraion time to 1ms
            cache.set("obj", {});

            setTimeout(function() {
                assert(!cache.get("obj"));
                done();
            }, 2);
        });
    });
});
