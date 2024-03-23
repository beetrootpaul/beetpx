import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";

export class DebugMode {
  static readonly #storageDebugDisabledKey = "beetpx__debug_disabled";
  static readonly #storageDebugDisabledTrue = "yes";

  static #enabled = false;

  static loadFromStorage(): void {
    this.#enabled =
      window.localStorage.getItem(this.#storageDebugDisabledKey) !==
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
      window.localStorage.removeItem(this.#storageDebugDisabledKey);
    } else {
      window.localStorage.setItem(
        this.#storageDebugDisabledKey,
        this.#storageDebugDisabledTrue,
      );
    }
  }
}
