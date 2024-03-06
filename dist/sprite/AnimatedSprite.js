var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxAnimatedSprite_sprites, _BpxAnimatedSprite_loop;
import { timer_, v_ } from "../shorthands";
import { BpxSprite } from "./Sprite";
export class BpxAnimatedSprite {
    static from(imageUrl, w, h, xys) {
        return new BpxAnimatedSprite({ imageUrl, w, h, xys });
    }
    constructor(params) {
        this.type = "animated";
        _BpxAnimatedSprite_sprites.set(this, void 0);
        _BpxAnimatedSprite_loop.set(this, void 0);
        this.imageUrl = params.imageUrl;
        this.size = v_(params.w, params.h).abs().round();
        __classPrivateFieldSet(this, _BpxAnimatedSprite_sprites, params.xys.map(([x, y]) => BpxSprite.from(params.imageUrl, params.w, params.h, x, y)), "f");
        __classPrivateFieldSet(this, _BpxAnimatedSprite_loop, timer_(__classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f").length, { loop: true }), "f");
    }
    get current() {
        return __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f")[__classPrivateFieldGet(this, _BpxAnimatedSprite_loop, "f").t];
    }
    pause() {
        __classPrivateFieldGet(this, _BpxAnimatedSprite_loop, "f").pause();
    }
    resume() {
        __classPrivateFieldGet(this, _BpxAnimatedSprite_loop, "f").resume();
    }
    restart() {
        __classPrivateFieldGet(this, _BpxAnimatedSprite_loop, "f").restart();
    }
}
_BpxAnimatedSprite_sprites = new WeakMap(), _BpxAnimatedSprite_loop = new WeakMap();
