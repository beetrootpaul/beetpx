import { ScopedLocaleStorage } from "./ScopedLocaleStorage";
export class StorageApi {
    static #key = "game__stored_state";
    savePersistedState(value) {
        ScopedLocaleStorage.setItem(StorageApi.#key, value);
    }
    loadPersistedState() {
        return ScopedLocaleStorage.getItem(StorageApi.#key);
    }
    clearPersistedState() {
        ScopedLocaleStorage.removeItem(StorageApi.#key);
    }
}
