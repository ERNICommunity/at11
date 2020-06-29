import Axios from "axios";

const OCR_ENDPOINT = "https://at11ocr.azurewebsites.net/api/process";
const OCR_TIMEOUT = 25_000;

export type DocumentType = "pdf" | "image" | "encoded";

export class OcrService {
    static async scanData(data: string, documentType: DocumentType): Promise<string> {
        try {
            const url = `${OCR_ENDPOINT}/${documentType}`;
            const requestBody = `=${encodeURIComponent(data)}`;

            const response = await Axios.post(url, requestBody, {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                timeout: OCR_TIMEOUT
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