import { Moment } from "moment-timezone";
import { IMenuItem } from "./IMenuItem";

export interface IParser {
    parse(html: string, date: Moment, doneCallback: (menu: IMenuItem[]) => void): void;
}
