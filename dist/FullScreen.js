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
var _FullScreenSupported_instances, _FullScreenSupported_fullScreenSubject, _FullScreenSupported_nativeRequestFullscreen, _FullScreenSupported_nativeExitFullscreen, _FullScreenSupported_fullScreenOn, _FullScreenSupported_fullScreenOff;
export class FullScreen {
    static newFor(fullScreenSubjectSelector, buttonsSelector) {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled
            ? new FullScreenSupported(fullScreenSubjectSelector)
            : new FullScreenNoop(buttonsSelector);
    }
}
class FullScreenNoop {
    constructor(buttonsSelector) {
        document
            .querySelectorAll(buttonsSelector)
            .forEach((button) => {
            button.style.display = "none";
        });
    }
    toggle() { }
}
// noinspection SuspiciousTypeOfGuard
class FullScreenSupported {
    constructor(fullScreenSubjectSelector) {
        var _a, _b, _c, _d;
        _FullScreenSupported_instances.add(this);
        _FullScreenSupported_fullScreenSubject.set(this, void 0);
        _FullScreenSupported_nativeRequestFullscreen.set(this, void 0);
        _FullScreenSupported_nativeExitFullscreen.set(this, void 0);
        const fullScreenSubject = document.querySelector(fullScreenSubjectSelector);
        if (!fullScreenSubject) {
            throw Error(`Was unable to find a full screen subject by selector '${fullScreenSubjectSelector}'`);
        }
        __classPrivateFieldSet(this, _FullScreenSupported_fullScreenSubject, fullScreenSubject, "f");
        const nativeRequestFullscreen = (_b = (_a = __classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f").requestFullscreen) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f").webkitRequestFullscreen) !== null && _b !== void 0 ? _b : (() => { });
        __classPrivateFieldSet(this, _FullScreenSupported_nativeRequestFullscreen, nativeRequestFullscreen.bind(__classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f")), "f");
        const nativeExitFullscreen = (_d = (_c = document.exitFullscreen) !== null && _c !== void 0 ? _c : document.webkitExitFullscreen) !== null && _d !== void 0 ? _d : (() => { });
        __classPrivateFieldSet(this, _FullScreenSupported_nativeExitFullscreen, nativeExitFullscreen.bind(document), "f");
    }
    toggle() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            __classPrivateFieldGet(this, _FullScreenSupported_instances, "m", _FullScreenSupported_fullScreenOff).call(this);
        }
        else {
            __classPrivateFieldGet(this, _FullScreenSupported_instances, "m", _FullScreenSupported_fullScreenOn).call(this);
        }
    }
}
_FullScreenSupported_fullScreenSubject = new WeakMap(), _FullScreenSupported_nativeRequestFullscreen = new WeakMap(), _FullScreenSupported_nativeExitFullscreen = new WeakMap(), _FullScreenSupported_instances = new WeakSet(), _FullScreenSupported_fullScreenOn = function _FullScreenSupported_fullScreenOn() {
    const result = __classPrivateFieldGet(this, _FullScreenSupported_nativeRequestFullscreen, "f").call(this);
    if (result instanceof Promise) {
        result.catch((err) => {
            console.error(err);
        });
    }
}, _FullScreenSupported_fullScreenOff = function _FullScreenSupported_fullScreenOff() {
    const result = __classPrivateFieldGet(this, _FullScreenSupported_nativeExitFullscreen, "f").call(this);
    if (result instanceof Promise) {
        result.catch((err) => {
            console.error(err);
        });
    }
};
