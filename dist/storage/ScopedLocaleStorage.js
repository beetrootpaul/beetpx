export class ScopedLocaleStorage {
    static #gameId;
    static set gameId(value) {
        this.#gameId = value;
    }
    static setItem(key, value) {
        window.localStorage.setItem(`bpx__${this.#gameId}__${key}`, JSON.stringify(value, null, 2));
    }
    static getItem(key) {
        const maybeValue = window.localStorage.getItem(`bpx__${this.#gameId}__${key}`);
        return maybeValue ? JSON.parse(maybeValue) : null;
    }
    static removeItem(key) {
        window.localStorage.removeItem(`bpx__${this.#gameId}__${key}`);
    }
}
