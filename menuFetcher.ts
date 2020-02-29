import { Moment } from "moment-timezone";
import request from "request";

import { Cache } from "./cache";
import { IConfig } from "./config";
import { IMenuItem } from "./parsers/IMenuItem";
import { IParser } from "./parsers/IParser";

export class MenuFetcher {
    constructor(private _config: IConfig, private _cache: Cache<IMenuItem[]>) {}

    public fetchMenu(urlFactory: (date: Moment) => string,
                     date: Moment,
                     parser: IParser,
                     doneCallback: (err: Error, result: ReturnType<Cache<IMenuItem[]>["get"]>) => void) {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this._cache.get(cacheKey);
        if (cached && !this._config.bypassCache) {
            doneCallback(null, cached);
        } else {
            this.load(url, date, parser, (error: Error, menu: IMenuItem[]) => {
                if (!error) {
                    this._cache.set(cacheKey, menu);
                    // we need to go through cache to get cache timestamp
                    doneCallback(null, this._cache.get(cacheKey));
                } else {
                    console.error("Error for %s: %s", url, error);
                    doneCallback(error, null);
                }
            });
        }
    }

    private load(url: string,
                 date: Moment,
                 parser: IParser,
                 doneCallback: (error: Error, menu: IMenuItem[]) => void) {
        // on production (azure) use scraper api for zomato requests, otherwise zomato blocks them
        if(this._config.isProduction && url.search("zomato")>=0) {
            url = `http://api.scraperapi.com?api_key=${this._config.scraperApiKey}&url=${encodeURIComponent(url)}`;
        }
        const options = {
            url,
            method: "GET",
            headers: { // some sites need us to pretend to be a browser to work
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "text/html,*/*"
            },
            timeout: 10 * 1000 // 10s timeout for request
        };
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let timer = setTimeout(() => {
                    timer = null; // clear needed as value is kept even after timeout fired
                    doneCallback(new Error("Parser timeout"), null);
                }, this._config.parserTimeout);

                try {
                    parser.parse(body, date, (menu) => {
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
