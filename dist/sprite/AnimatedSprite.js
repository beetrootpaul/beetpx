import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { repeatEachElement } from "../utils/repeatEachElement";
import { BpxSprite } from "./Sprite";
/**
 * A definition of an animated sprite,
 * which can later be used (indirectly) for drawing by {@link BeetPxDraw.sprite}.
 *
 * It has a form of a collection sprites, originated from the
 * same sprite sheet.
 *
 * @examples
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
    static from(imageUrl, w, h, xys, opts) {
        return new BpxAnimatedSprite({ imageUrl, w, h, xys }, {
            frameDuration: opts?.frameDuration ?? 1,
            paused: opts?.paused ?? false,
            onGamePause: opts?.onGamePause ?? "pause",
        });
    }
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of sprites.
     *
     * @example
     * ```ts
     * const s: BpxSprite | BpxAnimatedSprite = getSprite();
     * if (s.type === "static") {
     *   
     * } else if (s.type === "animated") {
     *   
     * } else {
     *   $u.assertUnreachable(s);
     * }
     * ```
     */
    type = "animated";
    imageUrl;
    size;
    #sprites;
    #loop;
    constructor(params, opts) {
        this.imageUrl = params.imageUrl;
        this.size = BpxVector2d.of(params.w, params.h).abs().round();
        this.#sprites = repeatEachElement(Math.max(1, Math.round(opts.frameDuration)), params.xys.map(([x, y]) => BpxSprite.from(params.imageUrl, params.w, params.h, x, y)));
        this.#loop = BpxTimer.of({
            frames: this.#sprites.length,
            loop: true,
            paused: opts.paused,
            delayFrames: 0,
            onGamePause: opts.onGamePause,
        });
    }
    /**
     * A sprite to be drawn in the current game loop iteration.
     */
    get current() {
        return this.#sprites[this.#loop.t];
    }
    /**
     * Pauses the animation.
     */
    pause() {
        this.#loop.pause();
    }
    /**
     * Resumes the animation.
     */
    resume() {
        this.#loop.resume();
    }
    /**
     * Restarts the animation from its first frame.
     */
    restart() {
        this.#loop.restart();
    }
}
