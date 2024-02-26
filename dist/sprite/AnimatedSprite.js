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
var _BpxAnimatedSprite_sprites;
import { BeetPx } from "../BeetPx";
import { v_ } from "../misc/Vector2d";
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
        this.imageUrl = imageUrl;
        this.size = v_(w, h).round();
        __classPrivateFieldSet(this, _BpxAnimatedSprite_sprites, xys.map(([x, y]) => BpxSprite.from(imageUrl, w, h, x, y)), "f");
    }
    
    get current() {
        const frame = BeetPx.frameNumber % __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f").length;
        return __classPrivateFieldGet(this, _BpxAnimatedSprite_sprites, "f")[frame];
    }
}
_BpxAnimatedSprite_sprites = new WeakMap();
