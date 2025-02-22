export interface IMenuItem {
    text: string;
    price: number;
    isSoup: boolean;
}

export interface IParser {
    parse(html: string, date: Date): Promise<IMenuItem[]>;
}
