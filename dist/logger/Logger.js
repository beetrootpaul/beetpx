import { DebugMode } from "../debug/DebugMode";
export class Logger {
    static #prefix = "[BeetPx]";
    static debugBeetPx(...args) {
        Logger.debug(Logger.#prefix, ...args);
    }
    static debug(...args) {
        if (DebugMode.enabled) {
            console.debug(...args.map(value => (value != null &&
                typeof value === "object" &&
                "__printDebug" in value &&
                typeof value.__printDebug === "function") ?
                value.__printDebug()
                : value));
        }
    }
    static infoBeetPx(...args) {
        Logger.info(Logger.#prefix, ...args);
    }
    static info(...args) {
        console.info(...args.map(value => (value != null &&
            typeof value === "object" &&
            "__printDebug" in value &&
            typeof value.__printDebug === "function") ?
            value.__printDebug()
            : value));
    }
    static warnBeetPx(...args) {
        Logger.warn(Logger.#prefix, ...args);
    }
    static warn(...args) {
        console.warn(...args.map(value => (value != null &&
            typeof value === "object" &&
            "__printDebug" in value &&
            typeof value.__printDebug === "function") ?
            value.__printDebug()
            : value));
    }
    static errorBeetPx(...args) {
        Logger.error(Logger.#prefix, ...args);
    }
    static error(...args) {
        console.error(...args.map(value => (value != null &&
            typeof value === "object" &&
            "__printDebug" in value &&
            typeof value.__printDebug === "function") ?
            value.__printDebug()
            : value));
    }
}
//# sourceMappingURL=Logger.js.map