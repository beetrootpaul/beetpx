import { DebugMode } from "../debug/DebugMode";

export class Logger {
  static readonly #prefix = "[BeetPx]";

  static debugBeetPx(...args: any[]): void {
    Logger.debug(Logger.#prefix, ...args);
  }
  static debug(...args: any[]): void {
    if (DebugMode.enabled) {
      console.debug(...args);
    }
  }

  static infoBeetPx(...args: any[]): void {
    Logger.info(Logger.#prefix, ...args);
  }
  static info(...args: any[]): void {
    console.info(...args);
  }

  static warnBeetPx(...args: any[]): void {
    Logger.warn(Logger.#prefix, ...args);
  }
  static warn(...args: any[]): void {
    console.warn(...args);
  }

  static errorBeetPx(...args: any[]): void {
    Logger.error(Logger.#prefix, ...args);
  }
  static error(...args: any[]): void {
    console.error(...args);
  }
}
