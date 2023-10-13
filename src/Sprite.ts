import { BpxImageUrl } from "./Assets";
import { BpxVector2d, v2d_, v_ } from "./Vector2d";

type SpriteCreationHelper = (
  x1: number,
  y1: number,
  w: number,
  h: number,
) => BpxSprite;

export function spr_(imageUrl: BpxImageUrl): SpriteCreationHelper {
  return (x1: number, y1: number, w: number, h: number) => {
    const xy1 = v2d_(x1, y1);
    return new BpxSprite(imageUrl, xy1, v_.add(xy1, [w, h]));
  };
}

export class BpxSprite {
  imageUrl: BpxImageUrl;
  xy1: BpxVector2d;
  xy2: BpxVector2d;

  constructor(imageUrl: BpxImageUrl, xy1: BpxVector2d, xy2: BpxVector2d) {
    this.imageUrl = imageUrl;
    this.xy1 = v_.round(xy1);
    this.xy2 = v_.round(xy2);
  }

  size(): BpxVector2d {
    return v2d_(
      Math.abs(this.xy2[0] - this.xy1[0]),
      Math.abs(this.xy2[1] - this.xy1[1]),
    );
  }
}
