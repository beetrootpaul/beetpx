import { BpxRgbColor, rgb_ } from "../../../src";

export class ColorSequence {
  #current: BpxRgbColor;
  #directionUp: boolean;

  constructor(initialColor?: BpxRgbColor) {
    this.#current = initialColor ?? rgb_(0, 0, 0);
    this.#directionUp = true;
  }

  get current(): BpxRgbColor {
    return this.#current;
  }

  next() {
    let nextCombined =
      this.#current.r * 0x10000 +
      this.#current.g * 0x100 +
      this.#current.b +
      (this.#directionUp ? 0x010101 : -0x010101);
    if (nextCombined >= 0x1000000) {
      nextCombined -= 0x020202;
      this.#directionUp = false;
    }
    if (nextCombined < 0) {
      nextCombined += 0x020202;
      this.#directionUp = true;
    }
    this.#current = rgb_("#" + nextCombined.toString(16).padStart(6, "0"));
  }
}
