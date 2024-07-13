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
var _a, _GlobalPause_isEnabled, _GlobalPause_prevIsActive, _GlobalPause_isActive;
export class GlobalPause {
    static enable() {
        __classPrivateFieldSet(this, _a, true, "f", _GlobalPause_isEnabled);
    }
    static get isActive() {
        return __classPrivateFieldGet(this, _a, "f", _GlobalPause_isEnabled) ? __classPrivateFieldGet(this, _a, "f", _GlobalPause_isActive) : false;
    }
    static get wasJustActivated() {
        return __classPrivateFieldGet(this, _a, "f", _GlobalPause_isEnabled) ? __classPrivateFieldGet(this, _a, "f", _GlobalPause_isActive) && !__classPrivateFieldGet(this, _a, "f", _GlobalPause_prevIsActive) : false;
    }
    static get wasJustDeactivated() {
        return __classPrivateFieldGet(this, _a, "f", _GlobalPause_isEnabled) ? !__classPrivateFieldGet(this, _a, "f", _GlobalPause_isActive) && __classPrivateFieldGet(this, _a, "f", _GlobalPause_prevIsActive) : false;
    }
    static update() {
        __classPrivateFieldSet(this, _a, __classPrivateFieldGet(this, _a, "f", _GlobalPause_isActive), "f", _GlobalPause_prevIsActive);
    }
    static activate() {
        __classPrivateFieldSet(this, _a, true, "f", _GlobalPause_isActive);
    }
    static deactivate() {
        __classPrivateFieldSet(this, _a, false, "f", _GlobalPause_isActive);
    }
}
_a = GlobalPause;
_GlobalPause_isEnabled = { value: false };
_GlobalPause_prevIsActive = { value: false };
_GlobalPause_isActive = { value: false };
