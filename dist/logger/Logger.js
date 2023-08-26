var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Logger_prefix;
import { DebugMode } from "../debug/DebugMode";
export class Logger {
    static debugBeetPx(...args) {
        Logger.debug(__classPrivateFieldGet(Logger, _a, "f", _Logger_prefix), ...args);
    }
    static debug(...args) {
        if (DebugMode.enabled) {
            console.debug(...args);
        }
    }
    static infoBeetPx(...args) {
        Logger.info(__classPrivateFieldGet(Logger, _a, "f", _Logger_prefix), ...args);
    }
    static info(...args) {
        console.info(...args);
    }
    static warnBeetPx(...args) {
        Logger.warn(__classPrivateFieldGet(Logger, _a, "f", _Logger_prefix), ...args);
    }
    static warn(...args) {
        console.warn(...args);
    }
    static errorBeetPx(...args) {
        Logger.error(__classPrivateFieldGet(Logger, _a, "f", _Logger_prefix), ...args);
    }
    static error(...args) {
        console.error(...args);
    }
}
_a = Logger;
_Logger_prefix = { value: "[BeetPx]" };
