export class StorageApi {
    static #key = "game_stored_state";
    savePersistedState(value) {
        window.localStorage.setItem(StorageApi.#key, JSON.stringify(value, null, 2));
    }
    loadPersistedState() {
        const maybeValue = window.localStorage.getItem(StorageApi.#key);
        return maybeValue ? JSON.parse(maybeValue) : null;
    }
    clearPersistedState() {
        window.localStorage.removeItem(StorageApi.#key);
    }
}
