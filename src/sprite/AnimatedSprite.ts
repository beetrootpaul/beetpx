import { BpxImageUrl } from "../assets/Assets";
import { BeetPx } from "../BeetPx";
import { BpxVector2d, v_ } from "../misc/Vector2d";
import { BpxUtils } from "../Utils";
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

// TODO: use looped timer instead of own calculations
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

  #offsetFrame: number = 0;
  #pausedFrame: number | null = null;

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
    this.restart();
  }

  get current(): BpxSprite {
    const frame = BpxUtils.mod(
      (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame,
      this.#sprites.length,
    );
    return this.#sprites[frame]!;
  }

  pause(): void {
    if (this.#pausedFrame) {
      return;
    }
    this.#pausedFrame = BeetPx.frameNumber;
  }

  resume(): void {
    if (!this.#pausedFrame) {
      return;
    }
    this.#offsetFrame += BpxUtils.mod(
      BeetPx.frameNumber - this.#pausedFrame,
      this.#sprites.length,
    );
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = BpxUtils.mod(BeetPx.frameNumber, this.#sprites.length);
    this.#pausedFrame = null;
  }
}
