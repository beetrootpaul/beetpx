import { Logger } from "../logger/Logger";
export class FrameByFrame {
    static #active = false;
    static get active() {
        return FrameByFrame.#active;
    }
    static set active(value) {
        this.#active = value;
        Logger.infoBeetPx(`FrameByFrame flag set to: ${this.#active}`);
    }
}
