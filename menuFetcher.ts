import { IConfig } from "./config";
import { IMenuItem } from "./parsers/IMenuItem";
import { IParser } from "./parsers/IParser";
import NodeCache from "node-cache";
import { HtmlScraperService } from "./services/html-scraper.service";
import { promiseWithTimeout, TimeoutError } from "./parsers/promise-with-wait";

export interface IMenuResult {
    timestamp: Date;
    value: IMenuItem[] | Error;
}

export class MenuFetcher {
    private readonly _runningRequests: { [url: string]: ((error: Error, menu: IMenuItem[]) => void)[]; } = {};

    constructor(private readonly _config: IConfig, private readonly _cache: NodeCache) { }

    public fetchMenu(urlFactory: (date: Date) => string, date: Date, parser: IParser, doneCallback: (result: IMenuResult) => void): void {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this._cache.get<IMenuResult>(cacheKey);
        if (cached && !this._config.bypassCache) {
            doneCallback(cached);
        } else {
            this.load(url, date, parser, (error: Error, menu: IMenuItem[]) => {
                if (!error) {
                    this._cache.set(cacheKey, { value: menu, timestamp: Date.now() }, this._config.cacheExpiration);
                } else {
                    this._cache.set(cacheKey, { value: error, timestamp: Date.now() }, this._config.cacheExpiration / 2);
                }
                doneCallback(this._cache.get<IMenuResult>(cacheKey));
            });
        }
    }

    private load(url: string, date: Date, parser: IParser, doneCallback: (error: Error, menu: IMenuItem[]) => void) {
        if (this._runningRequests[url]) { // if request is already running, just add additional callback
            this._runningRequests[url].push(doneCallback);
            return;
        }
        this._runningRequests[url] = [doneCallback];

        const done = (e: Error, m: IMenuItem[]) => {
            const doneCallbacks = this._runningRequests[url];
            delete this._runningRequests[url];
            if (e) {
                console.error("Error for %s: %s", url, e);
            }
            doneCallbacks.forEach(dc => dc(e, m));
        };

        HtmlScraperService.scrape(url)
            .then((data: string) => {
                promiseWithTimeout(this._config.parserTimeout, () => parser.parse(data, date))
                    .then(menu => done(null, menu))
                    .catch(error => {
                        if (error instanceof TimeoutError) {
                            done(new Error(`Parsing timeout - timeout period elapsed to parse data with '${parser.constructor?.name}' parser`), null);
                        }
                        done(error, null);
                    });
            })
            .catch(error => done(error, null));
    }
}
