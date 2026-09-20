import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";

export class DebugMode {
  static readonly #storageDebugEnabledKey = "debug__enabled";
  static readonly #storageDebugEnabledTrue = "yes";

  static #enabled = false;

  static loadFromStorage(): void {
    this.#enabled =
      ScopedLocaleStorage.getItem(this.#storageDebugEnabledKey) ===
      this.#storageDebugEnabledTrue;

    HtmlTemplate.updateDebugClass(this.enabled);
  }

  static get enabled(): boolean {
    return this.#enabled;
  }

  static set enabled(value: boolean) {
    this.#enabled = value;

    Logger.infoBeetPx(`Debug flag set to: ${this.#enabled}`);

    HtmlTemplate.updateDebugClass(this.enabled);

    if (this.#enabled) {
      ScopedLocaleStorage.setItem(
        this.#storageDebugEnabledKey,
        this.#storageDebugEnabledTrue,
      );
    } else {
      ScopedLocaleStorage.removeItem(this.#storageDebugEnabledKey);
    }
  }
}
