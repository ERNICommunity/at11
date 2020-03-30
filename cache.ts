import { IConfig } from "./config";

export class Cache<T> {
    private readonly _store : { [key: string] : { timestamp: number, shortLived: boolean, value: T } } = {};

    constructor(private _config: IConfig) {
        setInterval(this.cleanUp, this._config.cacheExpiration / 2);
    }

    public set(key: string, value: T, shortLived: boolean = false) {
        this._store[key] = { value, timestamp: Date.now(), shortLived };
    }

    public get(key: string): { value: T, timestamp: number } {
        return this.isValid(key) ? this._store[key] : null;
    }

    private isValid(key: string): boolean {
        const enterTime = this._store[key] && this._store[key].timestamp;
        return !!enterTime && (enterTime + this._config.cacheExpiration / (this._store[key].shortLived ? 2 : 1) > Date.now());
    }

    private cleanUp() {
        for (const key in this._store) {
            if (this._store[key] && !this.isValid(key)) {
                delete this._store[key];
            }
        }
    }
}
