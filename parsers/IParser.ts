import { Moment } from "moment-timezone";
import { MenuItem } from "./MenuItem";

export interface IParser {
    parse(html: string, date: Moment, doneCallback: (menu: MenuItem[]) => void): void;
}
