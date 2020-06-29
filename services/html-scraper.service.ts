import Axios from "axios";
import { Config } from "../config";

const SCRAPER_ENDPOINT = "http://api.scraperapi.com";

export class HtmlScraperService {
    static config = new Config();

    static async scrape(url: string): Promise<string> {
        // on production (azure) use scraper api for zomato requests, otherwise zomato blocks them
        if (HtmlScraperService.config.isProduction && url.search("zomato") >= 0) {
            // eslint-disable-next-line no-param-reassign
            url = `${SCRAPER_ENDPOINT}?api_key=${HtmlScraperService.config.scraperApiKey}&url=${encodeURIComponent(url)}`;
        }

        try {
            const response = await Axios.get<string>(url, {
                method: "get",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    Accept: "text/html,*/*",
                    "Accept-Language": "sk" // we want response in slovak (useful for menu portals that use localization, like zomato)
                },
                timeout: HtmlScraperService.config.requestTimeout
            });

            if (response.status !== 200) {
                throw new Error( `Unexpected response - HTTP Code: ${response.status}`);
            }
            return response.data;
        } catch (error) {
            if (error.code === "ECONNABORTED") {
                throw new Error("Request timeout - page was not fetched in desired time");
            }
            throw error;
        }
    }
}
