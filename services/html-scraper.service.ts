import Axios from "axios";
import { config } from "../config";

export class HtmlScraperService {
    static async scrape(url: string): Promise<string> {
        // on production (azure) use scraper api for zomato requests, otherwise zomato blocks them
        if (config.isProduction && url.search("zomato") >= 0) {
            // eslint-disable-next-line no-param-reassign
            url = `${config.scraper.endpoint}?api_key=${config.scraper.apiKey}&url=${encodeURIComponent(url)}`;
        }

        try {
            const response = await Axios.get<string>(url, {
                method: "get",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    Accept: "text/html,*/*",
                    "Accept-Language": "sk" // we want response in slovak (useful for menu portals that use localization, like zomato)
                },
                timeout: config.requestTimeout
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
