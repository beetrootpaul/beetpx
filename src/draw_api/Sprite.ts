import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d, v_ } from "../misc/Vector2d";

type SpriteCreationHelper = (
  x1: number,
  y1: number,
  w: number,
  h: number,
) => BpxSprite;

export function spr_(imageUrl: BpxImageUrl): SpriteCreationHelper {
  return (x1: number, y1: number, w: number, h: number) => {
    const xy1 = v_(x1, y1);
    return new BpxSprite(imageUrl, xy1, xy1.add(v_(w, h)));
  };
}

export class BpxSprite {
  imageUrl: BpxImageUrl;
  xy1: BpxVector2d;
  xy2: BpxVector2d;

  constructor(imageUrl: BpxImageUrl, xy1: BpxVector2d, xy2: BpxVector2d) {
    this.imageUrl = imageUrl;
    this.xy1 = xy1.round();
    this.xy2 = xy2.round();
  }

  size(): BpxVector2d {
    return v_(
      Math.abs(this.xy2.x - this.xy1.x),
      Math.abs(this.xy2.y - this.xy1.y),
    );
  }
}
