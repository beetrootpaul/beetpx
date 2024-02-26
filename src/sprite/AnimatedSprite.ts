import { BpxImageUrl } from "../assets/Assets";
import { BeetPx } from "../BeetPx";
import { BpxVector2d, v_ } from "../misc/Vector2d";
import { BpxSprite } from "./Sprite";

type ImageBoundAnimatedSpriteFactory = (
  w: number,
  h: number,
  xys: [x: number, y: number][],
) => BpxAnimatedSprite;

export function aspr_(imageUrl: BpxImageUrl): ImageBoundAnimatedSpriteFactory {
  return (w: number, h: number, xys: [x: number, y: number][]) => {
    return BpxAnimatedSprite.from(imageUrl, w, h, xys);
  };
}

export class BpxAnimatedSprite {
  static from(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    xys: [x: number, y: number][],
  ): BpxAnimatedSprite {
    return new BpxAnimatedSprite(imageUrl, w, h, xys);
  }

  readonly type = "animated";

  readonly imageUrl: BpxImageUrl;
  readonly size: BpxVector2d;

  readonly #sprites: BpxSprite[];

  private constructor(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    xys: [x: number, y: number][],
  ) {
    this.imageUrl = imageUrl;
    this.size = v_(w, h).round();
    this.#sprites = xys.map(([x, y]) => BpxSprite.from(imageUrl, w, h, x, y));
  }

  // TODO: tests
  get current(): BpxSprite {
    const frame = BeetPx.frameNumber % this.#sprites.length;
    return this.#sprites[frame]!;
  }
}
