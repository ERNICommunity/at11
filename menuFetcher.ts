import Axios from "axios";

import { Cache } from "./cache";
import { IConfig } from "./config";
import { IMenuItem } from "./parsers/IMenuItem";
import { IParser } from "./parsers/IParser";

export class MenuFetcher {
    private readonly _runningRequests: { [url: string] : ((error: Error, menu: IMenuItem[]) => void)[]; } = {};

    constructor(private readonly _config: IConfig, private readonly _cache: Cache<Error | IMenuItem[]>) {}

    public fetchMenu(urlFactory: (date: Date) => string,
                     date: Date,
                     parser: IParser,
                     doneCallback: (result: ReturnType<Cache<Error | IMenuItem[]>["get"]>) => void) {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this._cache.get(cacheKey);
        if (cached && !this._config.bypassCache) {
            doneCallback(cached);
        } else {
            this.load(url, date, parser, (error: Error, menu: IMenuItem[]) => {
                if (!error) {
                    this._cache.set(cacheKey, menu);
                } else {
                    this._cache.set(cacheKey, error, true);
                }
                doneCallback(this._cache.get(cacheKey));
            });
        }
    }

    private load(url: string,
                 date: Date,
                 parser: IParser,
                 doneCallback: (error: Error, menu: IMenuItem[]) => void) {
        // on production (azure) use scraper api for zomato requests, otherwise zomato blocks them
        if(this._config.isProduction && url.search("zomato") >= 0) {
            url = `http://api.scraperapi.com?api_key=${this._config.scraperApiKey}&url=${encodeURIComponent(url)}`;
        }

        if(this._runningRequests[url]) { // if request is already running, just add additional callback
            this._runningRequests[url].push(doneCallback);
            return;
        }
        this._runningRequests[url] = [doneCallback];

        const done = (e: Error, m: IMenuItem[]) => {
            const doneCallbacks = this._runningRequests[url];
            delete this._runningRequests[url];
            if(e) {
                console.error("Error for %s: %s", url, e);
            }
            doneCallbacks.forEach(dc => dc(e, m));
        };

        Axios.get<string>(url, {
            method: "get",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                Accept: "text/html,*/*",
                "Accept-Language": "sk", // we want response in slovak (useful for menu portals that use localization, like zomato)
            },
            timeout: this._config.requestTimeout,
        }).then(response => {
            if (response.status === 200) {
                let timer = setTimeout(() => {
                    timer = null; // clear needed as value is kept even after timeout fired
                    done(new Error("Parser timeout"), null);
                }, this._config.parserTimeout);

                try {
                    parser.parse(response.data, date, (menu) => {
                        if (!timer) {
                            // multiple calls in parser or parser called back after timeout
                            return;
                        }
                        clearTimeout(timer);
                        timer = null;

                        done(null, menu);
                    });
                } catch (err) {
                    clearTimeout(timer);
                    timer = null;
                    done(err, null);
                }
            }
        }).catch(error => done(error, null));
    }
}
