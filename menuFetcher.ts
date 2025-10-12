import get, { isAxiosError } from "axios";
import NodeCache from "node-cache";

import { IConfig } from "./config";
import { IMenuItem, IParser } from "./parsers/types";
import { parserTimeout } from "./parsers/parserUtil";

export type IMenuResult =
    | {
          type: "menu";
          timestamp: Date;
          menu: IMenuItem[];
      }
    | {
          type: "error";
          timestamp: Date;
          error: string;
      };

export class MenuFetcher {
    private readonly _runningRequests: { [url: string]: Promise<IMenuItem[]> } =
        {};

    constructor(
        private readonly _config: IConfig,
        private readonly _cache: NodeCache,
    ) {}

    public async fetchMenu(date: Date, parser: IParser): Promise<IMenuResult> {
        const url = parser.urlFactory(date);
        const cacheKey = date.toISOString() + ":" + url;
        const cached = this._cache.get<IMenuResult>(cacheKey);
        if (cached && !this._config.bypassCache) {
            return cached;
        } else {
            try {
                const menu = await this.load(url, date, parser);
                this._cache.set<IMenuResult>(
                    cacheKey,
                    { type: "menu", menu, timestamp: new Date() },
                    this._config.cacheExpiration,
                );
            } catch (error) {
                console.error(
                    `Error loading menu from ${url}`,
                    isAxiosError(error) ? error.message : error,
                );
                this._cache.set<IMenuResult>(
                    cacheKey,
                    {
                        type: "error",
                        error: error.toString(),
                        timestamp: new Date(),
                    },
                    this._config.cacheExpiration / 2,
                );
            }
            return this._cache.get<IMenuResult>(cacheKey);
        }
    }

    private load(
        url: string,
        date: Date,
        parser: IParser,
    ): Promise<IMenuItem[]> {
        // on production (azure) use scraper api for zomato requests, otherwise zomato blocks them
        if (this._config.isProduction && url.search("zomato") >= 0) {
            url = `http://api.scraperapi.com?api_key=${this._config.scraperApiKey}&url=${encodeURIComponent(url)}`;
        }

        if (this._runningRequests[url] !== undefined) {
            return this._runningRequests[url];
        }

        this._runningRequests[url] = get<string>(url, {
            method: "get",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                Accept: "text/html,*/*",
                "Accept-Language": "sk", // we want response in slovak (useful for menu portals that use localization, like zomato)
            },
            timeout: this._config.requestTimeout,
        })
            .then((response) => {
                if (response.status === 200) {
                    return Promise.race([
                        parserTimeout(this._config.parserTimeout),
                        parser.parse(response.data, date),
                    ]);
                }
                throw new Error(
                    `Wrong response status ${response.status} for ${url}`,
                );
            })
            .finally(() => {
                delete this._runningRequests[url];
            });
        return this._runningRequests[url];
    }
}
