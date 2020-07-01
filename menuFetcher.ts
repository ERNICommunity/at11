import { config } from "./config";
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
    private pendingTasks = new Map<string, Promise<IMenuItem[]>>();

    constructor(private readonly _cache: NodeCache) { }

    public async fetchMenu(urlFactory: (date: Date) => string, date: Date, parser: IParser): Promise<IMenuResult> {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this._cache.get<IMenuResult>(cacheKey);
        if (cached && !config.cache.bypassCache) {
            return cached;
        } else {
            try {
                const menu = await this.load(url, date, parser);
                this._cache.set(cacheKey, { value: menu, timestamp: Date.now() }, config.cache.expirationTime);
                return this._cache.get<IMenuResult>(cacheKey);
            } catch (error) {
                this._cache.set(cacheKey, { value: error, timestamp: Date.now() }, config.cache.expirationTime / 2);
                return this._cache.get<IMenuResult>(cacheKey);
            }
        }
    }

    private load(url: string, date: Date, parser: IParser): Promise<IMenuItem[]> {
        // to avoid parallel fetching and parsing for the same source (URL)
        if (this.pendingTasks.has(url)) {
            return this.pendingTasks.get(url);
        }

        const task = this.scrapeAndParse(url, date, parser);
        this.pendingTasks.set(url, task);
        return task.finally(() => this.pendingTasks.delete(url));
    }

    private async scrapeAndParse(url: string, date: Date, parser: IParser): Promise<IMenuItem[]> {
        try {
            const htmlData = await HtmlScraperService.scrape(url);
            return await promiseWithTimeout(config.parserTimeout, () => parser.parse(htmlData, date));
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new Error(`Parsing timeout - timeout period elapsed to parse data with '${parser.constructor?.name}' parser`);
            }

            throw error;
        }
    }
}
