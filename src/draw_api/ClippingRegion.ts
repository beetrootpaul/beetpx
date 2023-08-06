import { Vector2d } from "../Vector2d";

export class ClippingRegion {
  static of(xy1: Vector2d, xy2: Vector2d): ClippingRegion {
    return new ClippingRegion(xy1, xy2);
  }

  readonly #xy1: Vector2d;
  readonly #xy2: Vector2d;

  private constructor(xy1: Vector2d, xy2: Vector2d) {
    [this.#xy1, this.#xy2] = [Vector2d.min(xy1, xy2), Vector2d.max(xy1, xy2)];
  }

  allowsDrawingAt(xy: Vector2d): boolean {
    return xy.gte(this.#xy1) && xy.lt(this.#xy2);
  }
}
