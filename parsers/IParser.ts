import { IMenuItem } from "./IMenuItem";

export interface IParser {
    parse(html: string, date: Date): Promise<IMenuItem[]>;
}
