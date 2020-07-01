import Axios from "axios";
import { config } from "../config";

export type DocumentType = "pdf" | "image" | "encoded";

export class OcrService {
    static async scanData(data: string, documentType: DocumentType): Promise<string> {
        try {
            const url = `${config.ocr.endpoint}/${documentType}`;
            const requestBody = `=${encodeURIComponent(data)}`;

            const response = await Axios.post(url, requestBody, {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                timeout: config.ocr.timeout
            });

            return response.data;
        } catch (error) {
            if (error.code === "ECONNABORTED") {
                throw new Error("Request timeout - page was not fetched in desired time");
            }
            throw error;
        }
    }
}