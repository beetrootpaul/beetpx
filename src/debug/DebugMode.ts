import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";

export class DebugMode {
  static readonly #storageDebugDisabledKey = "debug__disabled";
  static readonly #storageDebugDisabledTrue = "yes";

  static #enabled = false;

  static loadFromStorage(): void {
    this.#enabled =
      ScopedLocaleStorage.getItem(this.#storageDebugDisabledKey) !==
      this.#storageDebugDisabledTrue;

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
      ScopedLocaleStorage.removeItem(this.#storageDebugDisabledKey);
    } else {
      ScopedLocaleStorage.setItem(
        this.#storageDebugDisabledKey,
        this.#storageDebugDisabledTrue,
      );
    }
  }
}
