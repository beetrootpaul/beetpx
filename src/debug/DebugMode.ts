import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";

export class DebugMode {
  static #enabled = false;
  static #frameByFrame: boolean = false;

  static get enabled(): boolean {
    return this.#enabled;
  }

  static set enabled(value: boolean) {
    this.#enabled = value;
    Logger.infoBeetPx(`Debug flag set to: ${this.#enabled}`);

    HtmlTemplate.updateDebugClass(DebugMode.enabled);
  }

  static get frameByFrame(): boolean {
    return DebugMode.#frameByFrame;
  }

  static toggleFrameByFrame(): void {
    this.#frameByFrame = !this.#frameByFrame;
    Logger.infoBeetPx(`FrameByFrame mode set to: ${this.#frameByFrame}`);
  }
}
