export class GlobalPause {
  static #isEnabled: boolean = false;

  static #prevIsActive: boolean = false;
  static #isActive: boolean = false;

  static enable(): void {
    this.#isEnabled = true;
  }

  static get isActive(): boolean {
    return this.#isEnabled ? this.#isActive : false;
  }

  static get wasJustActivated(): boolean {
    return this.#isEnabled ? this.#isActive && !this.#prevIsActive : false;
  }

  static get wasJustDeactivated(): boolean {
    return this.#isEnabled ? !this.#isActive && this.#prevIsActive : false;
  }

  static update(): void {
    this.#prevIsActive = this.#isActive;
  }

  static activate(): void {
    this.#isActive = true;
  }

  static deactivate(): void {
    this.#isActive = false;
  }
}
