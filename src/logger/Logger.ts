import { DebugMode } from "../debug/DebugMode";

export class Logger {
  static readonly #prefix = "[BeetPx]";

  static debugBeetPx(...args: unknown[]): void {
    Logger.debug(Logger.#prefix, ...args);
  }

  static debug(...args: unknown[]): void {
    if (DebugMode.enabled) {
      console.debug(
        ...args.map(value =>
          (
            value != null &&
            typeof value === "object" &&
            "__printDebug" in value &&
            typeof value.__printDebug === "function"
          ) ?
            value.__printDebug()
          : value,
        ),
      );
    }
  }

  static infoBeetPx(...args: unknown[]): void {
    Logger.info(Logger.#prefix, ...args);
  }

  static info(...args: unknown[]): void {
    console.info(
      ...args.map(value =>
        (
          value != null &&
          typeof value === "object" &&
          "__printDebug" in value &&
          typeof value.__printDebug === "function"
        ) ?
          value.__printDebug()
        : value,
      ),
    );
  }

  static warnBeetPx(...args: unknown[]): void {
    Logger.warn(Logger.#prefix, ...args);
  }

  static warn(...args: unknown[]): void {
    console.warn(
      ...args.map(value =>
        (
          value != null &&
          typeof value === "object" &&
          "__printDebug" in value &&
          typeof value.__printDebug === "function"
        ) ?
          value.__printDebug()
        : value,
      ),
    );
  }

  static errorBeetPx(...args: unknown[]): void {
    Logger.error(Logger.#prefix, ...args);
  }

  static error(...args: unknown[]): void {
    console.error(
      ...args.map(value =>
        (
          value != null &&
          typeof value === "object" &&
          "__printDebug" in value &&
          typeof value.__printDebug === "function"
        ) ?
          value.__printDebug()
        : value,
      ),
    );
  }
}
