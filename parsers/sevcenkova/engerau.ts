import { IMenuItem, IParser } from "../types";

export class Engerau implements IParser {
    public async parse(html: string, date: Date): Promise<IMenuItem[]> {
        return [];
    }
}
