import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { repeatEachElement } from "../utils/repeatEachElement";
import { BpxSprite } from "./Sprite";

export type BpxImageBoundAnimatedSpriteFactory = (
  w: number,
  h: number,
  xys: [x: number, y: number][],
  opts?: {
    frameDuration?: number;
    paused?: boolean;
    onGamePause?: "pause" | "ignore";
  },
) => BpxAnimatedSprite;

export class BpxAnimatedSprite {
  static from(
    imageUrl: BpxImageUrl,
    w: number,
    h: number,
    xys: [x: number, y: number][],
    opts?: {
      frameDuration?: number;
      paused?: boolean;
      onGamePause?: "pause" | "ignore";
    },
  ): BpxAnimatedSprite {
    return new BpxAnimatedSprite(
      { imageUrl, w, h, xys },
      {
        frameDuration: opts?.frameDuration ?? 1,
        paused: opts?.paused ?? false,
        onGamePause: opts?.onGamePause ?? "pause",
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
      frameDuration: number;
      paused: boolean;
      onGamePause: "pause" | "ignore";
    },
  ) {
    this.imageUrl = params.imageUrl;

    this.size = BpxVector2d.of(params.w, params.h).abs().round();

    this.#sprites = repeatEachElement(
      Math.max(1, Math.round(opts.frameDuration)),
      params.xys.map(([x, y]) =>
        BpxSprite.from(params.imageUrl, params.w, params.h, x, y),
      ),
    );

    this.#loop = BpxTimer.for({
      frames: this.#sprites.length,
      loop: true,
      paused: opts.paused,
      delayFrames: 0,
      onGamePause: opts.onGamePause,
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
