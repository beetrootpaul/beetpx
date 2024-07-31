export class ScopedLocaleStorage {
  static #gameId: string;

  static set gameId(value: string) {
    this.#gameId = value;
  }

  static setItem(key: string, value: unknown): void {
    window.localStorage.setItem(
      `bpx__${this.#gameId}__${key}`,
      JSON.stringify(value, null, 2),
    );
  }

  static getItem(key: string): unknown {
    const maybeValue = window.localStorage.getItem(
      `bpx__${this.#gameId}__${key}`,
    );
    return maybeValue ? JSON.parse(maybeValue) : null;
  }

  static removeItem(key: string): void {
    window.localStorage.removeItem(`bpx__${this.#gameId}__${key}`);
  }
}
