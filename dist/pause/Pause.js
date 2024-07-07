
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Pause_prevIsActive, _Pause_isActive;
export class Pause {
    static get isActive() {
        return __classPrivateFieldGet(this, _a, "f", _Pause_isActive);
    }
    static get wasJustActivated() {
        return __classPrivateFieldGet(this, _a, "f", _Pause_isActive) && !__classPrivateFieldGet(this, _a, "f", _Pause_prevIsActive);
    }
    static get wasJustDeactivated() {
        return !__classPrivateFieldGet(this, _a, "f", _Pause_isActive) && __classPrivateFieldGet(this, _a, "f", _Pause_prevIsActive);
    }
    static update() {
        __classPrivateFieldSet(this, _a, __classPrivateFieldGet(this, _a, "f", _Pause_isActive), "f", _Pause_prevIsActive);
    }
    static toggle() {
        __classPrivateFieldSet(this, _a, !__classPrivateFieldGet(this, _a, "f", _Pause_isActive), "f", _Pause_isActive);
    }
}
_a = Pause;
_Pause_prevIsActive = { value: false };
_Pause_isActive = { value: false };
