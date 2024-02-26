import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d, v_ } from "../misc/Vector2d";

type ImageBoundSpriteFactory = (
  w: number,
  h: number,
  x: number,
  y: number,
) => BpxSprite;

export function spr_(imageUrl: BpxImageUrl): ImageBoundSpriteFactory {
  return (w: number, h: number, x: number, y: number) =>
    BpxSprite.from(imageUrl, w, h, x, y);
}

export class BpxSprite {
  static from(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    x: number,
    y: number,
  ): BpxSprite {
    return new BpxSprite(imageUrl, w, h, x, y);
  }

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
    this.xy = v_(x, y).round();
    this.size = v_(x + w, y + h)
      .round()
      .sub(this.xy);
  }

  clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite {
    const xy = this.xy.clamp(xy1, xy2);
    const wh = this.xy.add(this.size).clamp(xy1, xy2).sub(xy);
    return new BpxSprite(this.imageUrl, wh.x, wh.y, xy.x, xy.y);
  }
}
