import NodeCache from "node-cache";

import { config } from "./config";
import { IMenuItem } from "./parsers/IMenuItem";
import { IParser } from "./parsers/IParser";
import { HtmlScraperService } from "./services/html-scraper.service";
import { promiseWithTimeout, TimeoutError } from "./parsers/promise-with-wait";

export interface IMenuResult {
    timestamp: Date;
    value: IMenuItem[] | Error;
}

export class MenuFetcher {
    private readonly cache = new NodeCache({ checkperiod: (config.cache.expirationTime / 2) });
    private readonly pendingTasks = new Map<string, Promise<IMenuItem[]>>();

    async fetchMenu(urlFactory: (date: Date) => string, date: Date, parser: IParser): Promise<IMenuResult> {
        const url = urlFactory(date);
        const cacheKey = date + ":" + url;
        const cached = this.cache.get<IMenuResult>(cacheKey);
        
        if (cached && !config.cache.bypassCache) {
            return cached;
        }

        let value: IMenuItem[] | Error;
        let expirationTime = config.cache.expirationTime;
        try {
            value = await this.fetchMenuInternal(url, date, parser);
        } catch (error) {
            value = error;
            expirationTime = config.cache.expirationTime / 2;
        }
        
        const result: IMenuResult = { value, timestamp: new Date() };
        this.cache.set(cacheKey, result, expirationTime);

        return result;
    }

    private fetchMenuInternal(url: string, date: Date, parser: IParser): Promise<IMenuItem[]> {
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
