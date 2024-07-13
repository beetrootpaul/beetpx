// TODO: add a config flag that allows to skip built-in pause support

export class GlobalPause {
  static #prevIsActive: boolean = false;
  static #isActive: boolean = false;

  static get isActive(): boolean {
    return this.#isActive;
  }

  static get wasJustActivated(): boolean {
    return this.#isActive && !this.#prevIsActive;
  }

  static get wasJustDeactivated(): boolean {
    return !this.#isActive && this.#prevIsActive;
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
