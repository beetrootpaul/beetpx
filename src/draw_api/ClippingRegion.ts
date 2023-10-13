import { BpxVector2d, v_ } from "../Vector2d";

export class BpxClippingRegion {
  readonly #xy1: BpxVector2d;
  readonly #xy2: BpxVector2d;

  constructor(xy: BpxVector2d, wh: BpxVector2d) {
    this.#xy1 = v_.round(xy);
    this.#xy2 = v_.round(v_.add(xy, wh));
    [this.#xy1, this.#xy2] = v_.minMax(this.#xy1, this.#xy2);
  }

  // TODO: consider a faster implementation based on bitmasks for a continuous chunks of pixels
  allowsDrawingAt(xy: BpxVector2d): boolean {
    return v_.gte(xy, this.#xy1) && v_.lt(xy, this.#xy2);
  }
}
