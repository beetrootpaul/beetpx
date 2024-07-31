import { ScopedLocaleStorage } from "./ScopedLocaleStorage";

export type BpxPersistedStateValueConstraints = Record<
  string,
  string | number | boolean | null
>;

export class StorageApi {
  static readonly #key: string = "game__stored_state";

  savePersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(value: PersistedStateValue): void {
    ScopedLocaleStorage.setItem(StorageApi.#key, value);
  }

  loadPersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(): PersistedStateValue | null {
    return ScopedLocaleStorage.getItem(
      StorageApi.#key,
    ) as PersistedStateValue | null;
  }

  clearPersistedState(): void {
    ScopedLocaleStorage.removeItem(StorageApi.#key);
  }
}
