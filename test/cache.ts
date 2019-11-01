import assert from "assert";
import { describe, it } from "mocha";

import { Cache } from "../cache.js";
import { IConfig } from "../config.js";

describe("cache", () => {
    const config: IConfig = {
        port: 1,
        isProductionEnvironmnet: false,
        bypassCache: false,
        cacheExpiration: 1,
        parserTimeout: 1,
        restaurants: []
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
            // cache expiraion time is set to 1ms
            cache.set("expire", "value");

            setTimeout(() => {
                assert.equal(cache.get("expire"), null);
                done();
            }, 2);
        });
    });
});
