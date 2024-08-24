import { ScopedLocaleStorage } from "./ScopedLocaleStorage";

/**
 * A simple JSON-like type constraint for values that can be persisted with use of
 * {@link BeetPx.savePersistedState}.
 *
 * @category Storage
 */
export type BpxPersistedStateValueConstraints = Record<
  string,
  string | number | boolean | null | undefined
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
  >(): Partial<PersistedStateValue> | null {
    return ScopedLocaleStorage.getItem(
      StorageApi.#key,
    ) as Partial<PersistedStateValue> | null;
  }

  clearPersistedState(): void {
    ScopedLocaleStorage.removeItem(StorageApi.#key);
  }
}
