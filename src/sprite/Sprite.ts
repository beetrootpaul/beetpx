import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d } from "../misc/Vector2d";

/**
 * @see {@link $spr}
 *
 * @category Drawing
 */
export type BpxImageBoundSpriteFactory = (
  w: number,
  h: number,
  x: number,
  y: number,
) => BpxSprite;

/**
 * A definition of a sprite,
 * which can later be used for drawing by {@link BeetPxDraw.sprite}.
 *
 * @see {@link $spr}
 *
 * @category Drawing
 */
export class BpxSprite {
  /**
   * @see {@link $spr}
   *
   * @group Static factories
   */
  static from(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    x: number,
    y: number,
  ): BpxSprite {
    return new BpxSprite(imageUrl, w, h, x, y);
  }

  /**
   * A property helpful for TypeScript type inference, when distinguishing from
   * other types of sprites.
   *
   * @example
   * ```ts
   * const s: BpxSprite | BpxAnimatedSprite = getSprite();
   * if (s.type === "static") {
   *   // s is BpxSprite here
   * } else if (s.type === "animated") {
   *   // s is BpxAnimatedSprite here
   * } else {
   *   $u.assertUnreachable(s);
   * }
   * ```
   */
  readonly type = "static";

  readonly imageUrl: BpxImageUrl;
  readonly size: BpxVector2d;
  readonly xy: BpxVector2d;

  private constructor(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    x: number,
    y: number,
  ) {
    if (w < 0) {
      w = -w;
      x -= w;
    }
    if (h < 0) {
      h = -h;
      y -= h;
    }

    this.imageUrl = imageUrl;
    this.xy = BpxVector2d.of(x, y).round();
    this.size = BpxVector2d.of(x + w, y + h)
      .round()
      .sub(this.xy);
  }

  /**
   * Creates a new sprite definition, clipped by given sprite coordinates.
   */
  clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite {
    const xy = this.xy.clamp(xy1, xy2);
    const wh = this.xy.add(this.size).clamp(xy1, xy2).sub(xy);
    return new BpxSprite(this.imageUrl, wh.x, wh.y, xy.x, xy.y);
  }
}
