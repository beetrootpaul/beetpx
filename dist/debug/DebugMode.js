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
var _a, _DebugMode_enabled;
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
export class DebugMode {
    static get enabled() {
        return __classPrivateFieldGet(this, _a, "f", _DebugMode_enabled);
    }
    static set enabled(value) {
        __classPrivateFieldSet(this, _a, value, "f", _DebugMode_enabled);
        Logger.infoBeetPx(`Debug flag set to: ${__classPrivateFieldGet(this, _a, "f", _DebugMode_enabled)}`);
        HtmlTemplate.updateDebugClass(DebugMode.enabled);
    }
}
_a = DebugMode;
_DebugMode_enabled = { value: false };
// TODO: consider `private _abc` notation instead of `#abc`
