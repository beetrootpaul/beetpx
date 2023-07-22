type StorageApiValueConstraint = Record<string, string | number | boolean | null>;
export declare class StorageApi {
    #private;
    store<StorageApiValue extends StorageApiValueConstraint>(value: StorageApiValue): void;
    load<StorageApiValue extends StorageApiValueConstraint>(): StorageApiValue | null;
    clearStorage(): void;
}
export {};
