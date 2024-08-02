import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";
export class DebugMode {
    static #storageDebugDisabledKey = "debug__disabled";
    static #storageDebugDisabledTrue = "yes";
    static #enabled = false;
    static loadFromStorage() {
        this.#enabled =
            ScopedLocaleStorage.getItem(this.#storageDebugDisabledKey) !==
                this.#storageDebugDisabledTrue;
        HtmlTemplate.updateDebugClass(this.enabled);
    }
    static get enabled() {
        return this.#enabled;
    }
    static set enabled(value) {
        this.#enabled = value;
        Logger.infoBeetPx(`Debug flag set to: ${this.#enabled}`);
        HtmlTemplate.updateDebugClass(this.enabled);
        if (this.#enabled) {
            ScopedLocaleStorage.removeItem(this.#storageDebugDisabledKey);
        }
        else {
            ScopedLocaleStorage.setItem(this.#storageDebugDisabledKey, this.#storageDebugDisabledTrue);
        }
    }
}
//# sourceMappingURL=DebugMode.js.map