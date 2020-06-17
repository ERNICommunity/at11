import assert from "assert";
import { describe, it } from "mocha";

import { Cache } from "../cache.js";
import { IConfig } from "../config.js";

describe("cache", () => {
    const config: IConfig = {
        isProduction: false,
        scraperApiKey: "test_api_key",
        appInsightsInstrumentationKey: "test_instrumentation_key",
        port: 1,
        bypassCache: false,
        cacheExpiration: 10,
        requestTimeout: 1,
        parserTimeout: 1,
        restaurants: null
    };
    const cache = new Cache<string>(config);

    describe("set", () => {

        it("should exists", () => {
            assert(cache.set);
        });

        it("should not throw exception", () => {
            assert.doesNotThrow(() => {
                cache.set("abc", "test");
            });
        });
    });

    describe("get", () => {

        it("should exists", () => {
            assert(cache.get);
        });

        it("should not found what wasn't stored", () => {
            assert(!(cache.get("xyz")));
        });

        it("should found what was stored", () => {
            cache.set("test", "asdf");
            assert.strictEqual(cache.get("test").value, "asdf");
        });

        it("should expire", (done) => {
            cache.set("expire", "value");

            setTimeout(() => {
                assert.equal(cache.get("expire"), null);
                done();
            }, 11);
        });

        it("should expire in half time for short-lived", (done) => {
            cache.set("expire3", "value", true);

            setTimeout(() => {
                assert.equal(cache.get("expire3"), null);
                done();
            }, 6);
        });
    });
});
