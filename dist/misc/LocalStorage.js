"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LocalStorage_keyPrefix;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
class LocalStorage {
    constructor(keyPrefix) {
        _LocalStorage_keyPrefix.set(this, void 0);
        __classPrivateFieldSet(this, _LocalStorage_keyPrefix, keyPrefix, "f");
    }
    store(key, value) {
        window.localStorage.setItem(__classPrivateFieldGet(this, _LocalStorage_keyPrefix, "f") + key, JSON.stringify(value, null, 2));
    }
    load(key) {
        const maybeValue = window.localStorage.getItem(__classPrivateFieldGet(this, _LocalStorage_keyPrefix, "f") + key);
        return maybeValue ? JSON.parse(maybeValue) : null;
    }
}
exports.LocalStorage = LocalStorage;
_LocalStorage_keyPrefix = new WeakMap();
