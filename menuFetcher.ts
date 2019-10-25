import charset from "charset";
import iconv from "iconv-lite";
import { Moment } from "moment-timezone";
import request from "request";

import { Cache } from "./cache";
import { Config } from "./config";
import { IMenuItem } from "./parsers/IMenuItem";
import { IParser } from "./parsers/IParser";

export class MenuFetcher {
    constructor(private _config: Config, private _cache: Cache<IMenuItem[]>) {}

    public fetchMenu(url: string,
                     date: Moment,
                     parseCallback: IParser["parse"],
                     doneCallback: (err: Error, result: ReturnType<Cache<IMenuItem[]>["get"]>) => void) {
        const cached = this._cache.get(date + ":" + url);
        if (cached && !this._config.bypassCache) {
            doneCallback(null, cached);
        } else {
            this.load(url, date, parseCallback, (error: Error, menu: IMenuItem[]) => {
                if (!error) {
                    this._cache.set(date + ":" + url, menu);
                    // we need to go through cache to get cache timestamp
                    doneCallback(null, this._cache.get(date + ":" + url));
                } else {
                    console.error("Error for %s: %s", url, error);
                    doneCallback(error, null);
                }
            });
        }
    }

    private load(url: string,
                 date: Moment,
                 parseCallback: IParser["parse"],
                 doneCallback: (error: Error, menu: IMenuItem[]) => void) {
        const options = {
            url,
            method: "GET",
            encoding: "binary",
            headers: { // some sites need us to pretend to be a browser to work
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "text/html,*/*"
            },
            timeout: 10 * 1000 // 10s timeout for request
        };
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const enc = charset(response.headers, body);
                if (enc !== "utf-8") {
                    body = iconv.decode(new Buffer(body, "binary"), enc);
                }

                let timer = setTimeout(() => {
                    timer = null; // clear needed as value is kept even after timeout fired
                    doneCallback(new Error("Parser timeout"), null);
                }, this._config.parserTimeout);

                try {
                    parseCallback(body, date, (menu) => {
                        if (!timer) {
                            // multiple calls in parser or parser called after timeout
                            return;
                        }
                        clearTimeout(timer);
                        timer = null;

                        doneCallback(null, menu);
                    });
                } catch (err) {
                    clearTimeout(timer);
                    timer = null;
                    doneCallback(err, null);
                }
            } else {
                doneCallback(error || new Error("Response code " + response.statusCode), null);
            }
        });
    }
}
