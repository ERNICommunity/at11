import { IMenuItem } from "./IMenuItem";

export interface IParser {
    parse(html: string, date: Date, doneCallback: (menu: IMenuItem[]) => void): void;
}
