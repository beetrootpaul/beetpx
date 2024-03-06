var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PreparedSprites_cache;
import { u_ } from "../Utils";
import { rgb_ } from "../shorthands";
export class PreparedSprites {
    constructor() {
        _PreparedSprites_cache.set(this, new Map());
    }
    prepareOrGetFromCache(sprite, imgBytes, imgW, imgChannels) {
        const key = sprite.imageUrl +
            "::" +
            sprite.xy.x.toString() +
            ":" +
            sprite.xy.y.toString() +
            ":" +
            sprite.size.x.toString() +
            ":" +
            sprite.size.y.toString();
        if (__classPrivateFieldGet(this, _PreparedSprites_cache, "f").has(key)) {
            return __classPrivateFieldGet(this, _PreparedSprites_cache, "f").get(key);
        }
        const w = sprite.size.x;
        const h = sprite.size.y;
        const colors = u_
            .range(w)
            .map(() => u_.range(h).map(() => null));
        for (let spriteY = 0; spriteY < h; ++spriteY) {
            const imgY = sprite.xy.y + spriteY;
            for (let spriteX = 0; spriteX < w; ++spriteX) {
                const imgX = sprite.xy.x + spriteX;
                const imgIndex = (imgY * imgW + imgX) * imgChannels;
                colors[spriteX][spriteY] =
                    imgChannels === 3
                        ? rgb_(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                        : imgBytes[imgIndex + 3] >= 0xff / 2
                            ? rgb_(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                            : null;
            }
        }
        const preparedSprite = {
            w: sprite.size.x,
            h: sprite.size.y,
            colors: colors,
            cacheHit: true,
        };
        __classPrivateFieldGet(this, _PreparedSprites_cache, "f").set(key, preparedSprite);
        return { ...preparedSprite, cacheHit: false };
    }
}
_PreparedSprites_cache = new WeakMap();
