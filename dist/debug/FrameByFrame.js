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
var _a, _FrameByFrame_enabled;
import { Logger } from "../logger/Logger";
export class FrameByFrame {
    static get enabled() {
        return __classPrivateFieldGet(_a, _a, "f", _FrameByFrame_enabled);
    }
    static set enabled(value) {
        __classPrivateFieldSet(this, _a, value, "f", _FrameByFrame_enabled);
        Logger.infoBeetPx(`FrameByFrame flag set to: ${__classPrivateFieldGet(this, _a, "f", _FrameByFrame_enabled)}`);
    }
}
_a = FrameByFrame;
_FrameByFrame_enabled = { value: false };
