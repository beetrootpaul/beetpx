export class LocalStorage<StorageApiValue> {
  readonly #keyPrefix: string;

  constructor(keyPrefix: string) {
    this.#keyPrefix = keyPrefix;
  }

  store(key: string, value: StorageApiValue): void {
    window.localStorage.setItem(
      this.#keyPrefix + key,
      JSON.stringify(value, null, 2),
    );
  }

  load(key: string): StorageApiValue | null {
    const maybeValue: string | null = window.localStorage.getItem(
      this.#keyPrefix + key,
    );
    return maybeValue ? (JSON.parse(maybeValue) as StorageApiValue) : null;
  }
}
