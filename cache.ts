import { Config } from "./config";

export class Cache<T> {
    private _store = {};

    constructor(private _config: Config) {
        setInterval(this.cleanUp, this._config.cacheExpiration);
    }

    public set(key: string, value: T) {
        this._store[key] = { value, timestamp: Date.now() };
    }

    public get(key: string): { value: T, timestamp: number } {
        return this.isValid(key) ? this._store[key] : null;
    }

    private isValid(key: string): boolean {
        const enterTime = this._store[key] && this._store[key].timestamp;
        return !!enterTime && (enterTime + this._config.cacheExpiration > Date.now());
    }

    private cleanUp() {
        for (const key in this._store) {
            if (this._store[key] && !this.isValid(key)) {
                delete this._store[key];
            }
        }
    }
}
