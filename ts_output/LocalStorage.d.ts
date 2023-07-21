export declare class LocalStorage<StorageApiValue> {
    #private;
    constructor(keyPrefix: string);
    store(key: string, value: StorageApiValue): void;
    load(key: string): StorageApiValue | null;
}
