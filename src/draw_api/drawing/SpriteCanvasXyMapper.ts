import { BpxVector2d } from "../../misc/Vector2d";
import { $v } from "../../shorthands";

export class SpriteCanvasXyMapper {
  readonly #targetXy: BpxVector2d;
  readonly #scaleXy: BpxVector2d;

  constructor(targetXy: BpxVector2d, scaleXy: BpxVector2d) {
    this.#targetXy = targetXy;
    this.#scaleXy = scaleXy;
  }

  toCanvasXy(spriteXy: BpxVector2d): BpxVector2d {
    return $v(
      this.#targetXy.x + spriteXy.x * this.#scaleXy.x,
      this.#targetXy.y + spriteXy.y * this.#scaleXy.y,
    );
  }

  toSpriteXy(canvasX: number, canvasY: number): [number, number] {
    return [
      this.#scaleXy.x === 0
        ? 0
        : Math.floor((canvasX - this.#targetXy.x) / this.#scaleXy.x),
      this.#scaleXy.y === 0
        ? 0
        : Math.floor((canvasY - this.#targetXy.y) / this.#scaleXy.y),
    ];
  }
}
