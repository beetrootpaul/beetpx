import { Vector2d } from "../Vector2d";

export class ClippingRegion {
  readonly #xy1: Vector2d;
  readonly #xy2: Vector2d;

  constructor(xy: Vector2d, wh: Vector2d) {
    this.#xy1 = xy.round();
    this.#xy2 = xy.round().add(wh.round());
    [this.#xy1, this.#xy2] = Vector2d.minMax(this.#xy1, this.#xy2);
  }

  allowsDrawingAt(xy: Vector2d): boolean {
    return xy.gte(this.#xy1) && xy.lt(this.#xy2);
  }
}
