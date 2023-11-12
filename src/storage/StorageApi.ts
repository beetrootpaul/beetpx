type PersistedStateValueConstraints = Record<
  string,
  string | number | boolean | null
>;

export class StorageApi {
  static readonly #key: string = "game_stored_state";

  savePersistedState<
    PersistedStateValue extends PersistedStateValueConstraints,
  >(value: PersistedStateValue): void {
    window.localStorage.setItem(
      StorageApi.#key,
      JSON.stringify(value, null, 2),
    );
  }

  loadPersistedState<
    PersistedStateValue extends PersistedStateValueConstraints,
  >(): PersistedStateValue | null {
    const maybeValue: string | null = window.localStorage.getItem(
      StorageApi.#key,
    );
    return maybeValue ? JSON.parse(maybeValue) : null;
  }

  clearPersistedState(): void {
    window.localStorage.removeItem(StorageApi.#key);
  }
}
