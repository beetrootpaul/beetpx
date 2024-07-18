export class LocalStorage {
    #keyPrefix;
    constructor(keyPrefix) {
        this.#keyPrefix = keyPrefix;
    }
    store(key, value) {
        window.localStorage.setItem(this.#keyPrefix + key, JSON.stringify(value, null, 2));
    }
    load(key) {
        const maybeValue = window.localStorage.getItem(this.#keyPrefix + key);
        return maybeValue ? JSON.parse(maybeValue) : null;
    }
}
