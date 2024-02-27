import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d, v_ } from "../misc/Vector2d";
import { BpxTimer, timer_ } from "../timer/Timer";
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
    return new BpxAnimatedSprite({ imageUrl, w, h, xys });
  }

  readonly type = "animated";

  readonly imageUrl: BpxImageUrl;
  readonly size: BpxVector2d;

  readonly #sprites: BpxSprite[];
  readonly #loop: BpxTimer;

  private constructor(params: {
    imageUrl: BpxImageUrl;
    w: number;
    h: number;
    xys: [x: number, y: number][];
  }) {
    this.imageUrl = params.imageUrl;
    this.size = v_(params.w, params.h).abs().round();
    this.#sprites = params.xys.map(([x, y]) =>
      BpxSprite.from(params.imageUrl, params.w, params.h, x, y),
    );
    this.#loop = timer_(this.#sprites.length, { loop: true });
  }

  get current(): BpxSprite {
    return this.#sprites[this.#loop.t]!;
  }

  pause(): void {
    this.#loop.pause();
  }

  resume(): void {
    this.#loop.resume();
  }

  restart(): void {
    this.#loop.restart();
  }
}
