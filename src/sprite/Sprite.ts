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
 * TODO: docs
 *
 * @categoryTODO Drawing
 */
export class BpxSprite {
  /**
   * TODO: docs
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
   * TODO: docs
   */
  readonly type = "static";

  /**
   * TODO: docs
   */
  readonly imageUrl: BpxImageUrl;
  /**
   * TODO: docs
   */
  readonly size: BpxVector2d;
  /**
   * TODO: docs
   */
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
   * TODO: docs
   */
  clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite {
    const xy = this.xy.clamp(xy1, xy2);
    const wh = this.xy.add(this.size).clamp(xy1, xy2).sub(xy);
    return new BpxSprite(this.imageUrl, wh.x, wh.y, xy.x, xy.y);
  }
}
