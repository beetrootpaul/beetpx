import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { repeatEachElement } from "../utils/repeatEachElement";
import { BpxSprite } from "./Sprite";

/**
 * TODO: docs
 */
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

/**
 * TODO: docs
 */
export class BpxAnimatedSprite {
  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  readonly type = "animated";

  /**
   * TODO: docs
   */
  readonly imageUrl: BpxImageUrl;
  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  get current(): BpxSprite {
    return this.#sprites[this.#loop.t]!;
  }

  /**
   * TODO: docs
   */
  pause(): void {
    this.#loop.pause();
  }

  /**
   * TODO: docs
   */
  resume(): void {
    this.#loop.resume();
  }

  /**
   * TODO: docs
   */
  restart(): void {
    this.#loop.restart();
  }
}
