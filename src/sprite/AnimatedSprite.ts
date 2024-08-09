import { BpxImageUrl } from "../assets/Assets";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { repeatEachElement } from "../utils/repeatEachElement";
import { BpxSprite } from "./Sprite";

/**
 * @see {@link $aspr}
 *
 * @category Drawing
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
 * A definition of an animated sprite,
 * which can later be used (indirectly) for drawing by {@link BeetPxDraw.sprite}.
 *
 * It has a form of a collection sprites, originated from the
 * same sprite sheet.
 *
 * @example
 * ```ts
 * let myAnimation: BpxAnimatedSprite;
 *
 * $.setOnStarted(() => {
 *   myAnimation = $aspr("spritesheet.png")(8, 8, [
 *     [0,0],
 *     [8,0],
 *     [16,0],
 *   ]);
 * });
 *
 * $d.setOnDraw(() => {
 *   $d.sprite(myAnimation.current, $v(10));
 * });
 * ```
 *
 * @remarks
 * Under the hood this class uses {@link BpxTimer} to integrate
 * the animation progression with the game loop.
 *
 * @see {@link $aspr}
 *
 * @category Drawing
 */
export class BpxAnimatedSprite {
  /**
   * @see {@link $aspr}
   *
   * @group Static factories
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
   * A property helpful for TypeScript type inference, when distinguishing from
   * other types of sprites.
   *
   * @example
   * ```ts
   * const s: BpxSprite | BpxAnimatedSprite = getSprite();
   * if (s.type === "static") {
   *   // s is BpxSprite here
   * } else if (s.type === "animated") {
   *   // s is BpxAnimatedSprite here
   * } else {
   *   $u.assertUnreachable(s);
   * }
   * ```
   */
  readonly type = "animated";

  readonly imageUrl: BpxImageUrl;
  readonly size: BpxVector2d;

  readonly #sprites: BpxSprite[];
  readonly #loop: BpxTimer;

  readonly #frameDuration: number;

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

    this.#loop = BpxTimer.of({
      frames: this.#sprites.length,
      loop: true,
      paused: opts.paused,
      delayFrames: 0,
      onGamePause: opts.onGamePause,
    });

    this.#frameDuration = opts.frameDuration;
  }

  /**
   * A sprite to be drawn in the current game loop iteration.
   */
  get current(): BpxSprite {
    return this.#sprites[this.#loop.t]!;
  }

  /**
   * An index of the sprite from the list of sprites of this animation.
   */
  get t(): number {
    return Math.floor(this.#loop.t / this.#frameDuration);
  }

  /**
   * Pauses the animation.
   */
  pause(): void {
    this.#loop.pause();
  }

  /**
   * Resumes the animation.
   */
  resume(): void {
    this.#loop.resume();
  }

  /**
   * Restarts the animation from its first frame.
   */
  restart(): void {
    this.#loop.restart();
  }
}
