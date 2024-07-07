import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { BpxSprite } from "./Sprite";

export type BpxImageBoundAnimatedSpriteFactory = (
  w: number,
  h: number,
  xys: [x: number, y: number][],
  opts?: {
    pause?: boolean;
    ignoreGamePause?: boolean;
  },
) => BpxAnimatedSprite;

export class BpxAnimatedSprite {
  static from(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    xys: [x: number, y: number][],
    opts?: {
      pause?: boolean;
      ignoreGamePause?: boolean;
    },
  ): BpxAnimatedSprite {
    return new BpxAnimatedSprite(
      { imageUrl, w, h, xys },
      {
        pause: opts?.pause ?? false,
        ignoreGamePause: opts?.ignoreGamePause ?? false,
      },
    );
  }

  readonly type = "animated";

  readonly imageUrl: BpxImageUrl;
  readonly size: BpxVector2d;

  readonly #sprites: BpxSprite[];
  readonly #loop: BpxTimer;

  private constructor(
    params: {
      imageUrl: BpxImageUrl;
      w: number;
      h: number;
      xys: [x: number, y: number][];
    },
    opts: {
      pause?: boolean;
      ignoreGamePause: boolean;
    },
  ) {
    this.imageUrl = params.imageUrl;
    this.size = BpxVector2d.of(params.w, params.h).abs().round();
    this.#sprites = params.xys.map(([x, y]) =>
      BpxSprite.from(params.imageUrl, params.w, params.h, x, y),
    );
    this.#loop = BpxTimer.for({
      frames: this.#sprites.length,
      loop: true,
      pause: opts.pause ?? false,
      delayFrames: 0,
      ignoreGamePause: opts.ignoreGamePause,
    });
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
