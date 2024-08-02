import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { repeatEachElement } from "../utils/repeatEachElement";
import { BpxSprite } from "./Sprite";
export class BpxAnimatedSprite {
    static from(imageUrl, w, h, xys, opts) {
        return new BpxAnimatedSprite({ imageUrl, w, h, xys }, {
            frameDuration: opts?.frameDuration ?? 1,
            paused: opts?.paused ?? false,
            onGamePause: opts?.onGamePause ?? "pause",
        });
    }
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
    get current() {
        return this.#sprites[this.#loop.t];
    }
    pause() {
        this.#loop.pause();
    }
    resume() {
        this.#loop.resume();
    }
    restart() {
        this.#loop.restart();
    }
}
//# sourceMappingURL=AnimatedSprite.js.map