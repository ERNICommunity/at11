export interface IMenuItem {
    text: string;
    price: number;
    isSoup: boolean;
}

export interface IParser {
    urlFactory(date: Date): string;
    parse(html: string, date: Date): Promise<IMenuItem[]>;
}
