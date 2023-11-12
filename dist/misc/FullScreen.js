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
var _a, _FullScreen_isFullScreenSupported, _FullScreenSupported_instances, _FullScreenSupported_fullScreenSubject, _FullScreenSupported_nativeRequestFullscreen, _FullScreenSupported_nativeExitFullscreen, _FullScreenSupported_fullScreenOn, _FullScreenSupported_fullScreenOff;
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
export class FullScreen {
    isFullScreenSupported() {
        return __classPrivateFieldGet(FullScreen, _a, "f", _FullScreen_isFullScreenSupported);
    }
    static create() {
        return __classPrivateFieldGet(FullScreen, _a, "f", _FullScreen_isFullScreenSupported)
            ? new FullScreenSupported()
            : new FullScreenNoop();
    }
}
_a = FullScreen;

_FullScreen_isFullScreenSupported = { value: !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) };
class FullScreenNoop extends FullScreen {
    constructor() {
        super();
        document
            .querySelectorAll(HtmlTemplate.selectors.controlsFullScreen)
            .forEach((button) => {
            button.style.display = "none";
        });
    }
    isInFullScreen() {
        return false;
    }
    toggleFullScreen() { }
}

class FullScreenSupported extends FullScreen {
    constructor() {
        var _b, _c, _d, _e;
        super();
        _FullScreenSupported_instances.add(this);
        _FullScreenSupported_fullScreenSubject.set(this, void 0);
        _FullScreenSupported_nativeRequestFullscreen.set(this, void 0);
        _FullScreenSupported_nativeExitFullscreen.set(this, void 0);
        const fullScreenSubject = document.querySelector(HtmlTemplate.selectors.fullScreenSubject);
        if (!fullScreenSubject) {
            throw Error(`Was unable to find a full screen subject by selector '${HtmlTemplate.selectors.fullScreenSubject}'`);
        }
        __classPrivateFieldSet(this, _FullScreenSupported_fullScreenSubject, fullScreenSubject, "f");
        const nativeRequestFullscreen = (_c = (_b = __classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f").requestFullscreen) !== null && _b !== void 0 ? _b : __classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f").webkitRequestFullscreen) !== null && _c !== void 0 ? _c : (() => { });
        __classPrivateFieldSet(this, _FullScreenSupported_nativeRequestFullscreen, nativeRequestFullscreen.bind(__classPrivateFieldGet(this, _FullScreenSupported_fullScreenSubject, "f")), "f");
        const nativeExitFullscreen = (_e = (_d = document.exitFullscreen) !== null && _d !== void 0 ? _d : document.webkitExitFullscreen) !== null && _e !== void 0 ? _e : (() => { });
        __classPrivateFieldSet(this, _FullScreenSupported_nativeExitFullscreen, nativeExitFullscreen.bind(document), "f");
    }
    isInFullScreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    toggleFullScreen() {
        if (this.isInFullScreen()) {
            __classPrivateFieldGet(this, _FullScreenSupported_instances, "m", _FullScreenSupported_fullScreenOff).call(this);
        }
        else {
            __classPrivateFieldGet(this, _FullScreenSupported_instances, "m", _FullScreenSupported_fullScreenOn).call(this);
        }
    }
}
_FullScreenSupported_fullScreenSubject = new WeakMap(), _FullScreenSupported_nativeRequestFullscreen = new WeakMap(), _FullScreenSupported_nativeExitFullscreen = new WeakMap(), _FullScreenSupported_instances = new WeakSet(), _FullScreenSupported_fullScreenOn = function _FullScreenSupported_fullScreenOn() {
    const result = __classPrivateFieldGet(this, _FullScreenSupported_nativeRequestFullscreen, "f").call(this);
    if (typeof result === "object") {
        result.catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
}, _FullScreenSupported_fullScreenOff = function _FullScreenSupported_fullScreenOff() {
    const result = __classPrivateFieldGet(this, _FullScreenSupported_nativeExitFullscreen, "f").call(this);
    if (typeof result === "object") {
        result.catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
};
