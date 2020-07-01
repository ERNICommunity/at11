export async function promiseWithTimeout<T>(timeoutMs: number, promise: () => Promise<T>): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new TimeoutError(`Timed out in ${timeoutMs} ms`)),
            timeoutMs
        );
    });

    const result = await Promise.race([promise(), timeoutPromise]);
    clearTimeout(timeoutHandle);
    return result;
}

export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}