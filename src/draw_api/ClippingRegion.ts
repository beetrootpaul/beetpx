import { BpxVector2d } from "../Vector2d";

export class BpxClippingRegion {
  readonly #xy1: BpxVector2d;
  readonly #xy2: BpxVector2d;

  constructor(xy: BpxVector2d, wh: BpxVector2d) {
    this.#xy1 = xy.round();
    this.#xy2 = xy.add(wh).round();
    [this.#xy1, this.#xy2] = BpxVector2d.minMax(this.#xy1, this.#xy2);
  }

  // TODO: consider a faster implementation based on bitmasks for a continuous chunks of pixels
  allowsDrawingAt(xy: BpxVector2d): boolean {
    return xy.gte(this.#xy1) && xy.lt(this.#xy2);
  }
}
