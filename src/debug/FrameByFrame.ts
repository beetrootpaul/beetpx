import { Logger } from "../logger/Logger";

export class FrameByFrame {
  static #enabled = false;

  static get enabled(): boolean {
    return FrameByFrame.#enabled;
  }

  static set enabled(value) {
    this.#enabled = value;

    Logger.infoBeetPx(`FrameByFrame flag set to: ${this.#enabled}`);
  }
}
