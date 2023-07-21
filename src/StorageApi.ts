type StorageApiValueConstraint = Record<
  string,
  string | number | boolean | null
>;

export class StorageApi {
  static readonly #key: string = "game_stored_state";

  store<StorageApiValue extends StorageApiValueConstraint>(
    value: StorageApiValue,
  ): void {
    window.localStorage.setItem(
      StorageApi.#key,
      JSON.stringify(value, null, 2),
    );
  }

  // TODO: use zod or some other popular lib and validate value's shape here
  load<
    StorageApiValue extends StorageApiValueConstraint,
  >(): StorageApiValue | null {
    const maybeValue: string | null = window.localStorage.getItem(
      StorageApi.#key,
    );
    return maybeValue ? JSON.parse(maybeValue) : null;
  }

  clear(): void {
    window.localStorage.removeItem(StorageApi.#key);
  }
}
