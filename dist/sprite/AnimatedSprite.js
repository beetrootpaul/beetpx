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
var _BpxAnimatedSprite_sprites, _BpxAnimatedSprite_frameNumberOffset, _BpxAnimatedSprite_pausedFrameNumber;
import { BeetPx } from "../BeetPx";
import { v_ } from "../misc/Vector2d";
import { BpxUtils } from "../Utils";
import { BpxSprite } from "./Sprite";
export function aspr_(imageUrl) {
    return (w, h, xys) => {
        return BpxAnimatedSprite.from(imageUrl, w, h, xys);
    };
}
export class BpxAnimatedSprite {
    static from(imageUrl, w, h, xys) {
        return new BpxAnimatedSprite(imageUrl, w, h, xys);
    }
    constructor(imageUrl, w, h, xys) {
        this.type = "animated";
        _BpxAnimatedSprite_sprites.set(this, void 0);
        _BpxAnimatedSprite_frameNumberOffset.set(this, 0);
        _BpxAnimatedSprite_pausedFrameNumber.set(this, null);
        this.imageUrl = imageUrl;
        this.size = v_(w, h).round();
        __classPrivateFieldSet(this, _BpxAnimatedSprite_sprites, xys.map(([x, y]) => BpxSprite.from(imageUrl, w, h, x, y)), "f");
        this.restart();
    }
    
    get current() {
        const frame = BpxUtils.mod((__classPrivateFieldGet(this, _BpxAnimatedSprite_pausedFrameNumber, "f") ?? BeetPx.frameNumber) - __classPrivateFieldGet(this, _BpxAnimatedSprite_frameNumberOffset, "f"), __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f").length);
        return __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f")[frame];
    }
    
    pause() {
        if (__classPrivateFieldGet(this, _BpxAnimatedSprite_pausedFrameNumber, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BpxAnimatedSprite_pausedFrameNumber, BeetPx.frameNumber, "f");
    }
    
    resume() {
        if (!__classPrivateFieldGet(this, _BpxAnimatedSprite_pausedFrameNumber, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BpxAnimatedSprite_frameNumberOffset, __classPrivateFieldGet(this, _BpxAnimatedSprite_frameNumberOffset, "f") + BpxUtils.mod(BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxAnimatedSprite_pausedFrameNumber, "f"), __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f").length), "f");
        __classPrivateFieldSet(this, _BpxAnimatedSprite_pausedFrameNumber, null, "f");
    }
    
    restart() {
        __classPrivateFieldSet(this, _BpxAnimatedSprite_frameNumberOffset, BpxUtils.mod(BeetPx.frameNumber, __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f").length), "f");
        __classPrivateFieldSet(this, _BpxAnimatedSprite_pausedFrameNumber, null, "f");
    }
}
_BpxAnimatedSprite_sprites = new WeakMap(), _BpxAnimatedSprite_frameNumberOffset = new WeakMap(), _BpxAnimatedSprite_pausedFrameNumber = new WeakMap();
