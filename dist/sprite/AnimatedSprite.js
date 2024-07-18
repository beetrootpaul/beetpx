import { BpxVector2d } from "../misc/Vector2d";
import { BpxTimer } from "../timer/Timer";
import { BpxSprite } from "./Sprite";
export class BpxAnimatedSprite {
    static from(imageUrl, w, h, xys, opts) {
        return new BpxAnimatedSprite({ imageUrl, w, h, xys }, {
            pause: opts?.pause ?? false,
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
        this.#sprites = params.xys.map(([x, y]) => BpxSprite.from(params.imageUrl, params.w, params.h, x, y));
        this.#loop = BpxTimer.for({
            frames: this.#sprites.length,
            loop: true,
            pause: opts.pause ?? false,
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
