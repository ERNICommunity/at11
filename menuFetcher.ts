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
    private readonly pendingTasks: Map<string, Promise<IMenuItem[]>> = new Map<string, Promise<IMenuItem[]>>();

    constructor(private readonly _config: IConfig, private readonly _cache: NodeCache) { }

    public async fetchMenu(urlFactory: (date: Date) => string, date: Date, parser: IParser): Promise<IMenuResult> {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this._cache.get<IMenuResult>(cacheKey);
        if (cached && !this._config.bypassCache) {
            return cached;
        } else {
            try {
                const menu = await this.load(url, date, parser);
                this._cache.set(cacheKey, { value: menu, timestamp: Date.now() }, this._config.cacheExpiration);
                return this._cache.get<IMenuResult>(cacheKey);
            } catch (error) {
                this._cache.set(cacheKey, { value: error, timestamp: Date.now() }, this._config.cacheExpiration / 2);
                return this._cache.get<IMenuResult>(cacheKey);
            }
        }
    }

    private load(url: string, date: Date, parser: IParser): Promise<IMenuItem[]> {
        // if there was already task to fetch the same URL we will wait for the first task's result
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
            return await promiseWithTimeout(this._config.parserTimeout, () => parser.parse(htmlData, date));
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new Error(`Parsing timeout - timeout period elapsed to parse data with '${parser.constructor?.name}' parser`);
            }

            throw error;
        }
    }
}
