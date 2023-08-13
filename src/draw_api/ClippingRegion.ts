import { Vector2d } from "../Vector2d";

export class ClippingRegion {
  static of(xy: Vector2d, wh: Vector2d): ClippingRegion {
    return new ClippingRegion(xy, wh);
  }

  readonly #xy1: Vector2d;
  readonly #xy2: Vector2d;

  private constructor(xy: Vector2d, wh: Vector2d) {
    this.#xy1 = xy;
    this.#xy2 = xy.add(wh);
    [this.#xy1, this.#xy2] = Vector2d.minMax(this.#xy1, this.#xy2);
  }

  allowsDrawingAt(xy: Vector2d): boolean {
    return xy.gte(this.#xy1) && xy.lt(this.#xy2);
  }
}
