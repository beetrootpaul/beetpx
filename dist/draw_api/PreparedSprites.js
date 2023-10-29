var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PreparedSprites_instances, _PreparedSprites_cache, _PreparedSprites_keyPortionFromColorMapping;
import { BpxSolidColor, transparent_, } from "../Color";
import { u_ } from "../Utils";
export class PreparedSprites {
    constructor() {
        _PreparedSprites_instances.add(this);
        _PreparedSprites_cache.set(this, new Map());
    }
    prepareOrGetFromCache(sprite, imgBytes, imgW, imgChannels, 
    // TODO: consider making color mapping into a class, especially that we need an unique ID out of it later on
    colorMapping) {
        var _a;
        const key = sprite.imageUrl +
            "::" +
            sprite.xy1.x.toString() +
            ":" +
            sprite.xy1.y.toString() +
            ":" +
            sprite.xy2.x.toString() +
            ":" +
            sprite.xy2.y.toString() +
            "::" +
            __classPrivateFieldGet(this, _PreparedSprites_instances, "m", _PreparedSprites_keyPortionFromColorMapping).call(this, colorMapping);
        if (__classPrivateFieldGet(this, _PreparedSprites_cache, "f").has(key)) {
            return __classPrivateFieldGet(this, _PreparedSprites_cache, "f").get(key);
        }
        const w = sprite.size().x;
        const h = sprite.size().y;
        const colors = u_
            .range(w)
            .map(() => u_.range(h).map(() => null));
        for (let spriteY = 0; spriteY < h; ++spriteY) {
            const imgY = sprite.xy1.y + spriteY;
            for (let spriteX = 0; spriteX < w; ++spriteX) {
                const imgX = sprite.xy1.x + spriteX;
                const imgIndex = (imgY * imgW + imgX) * imgChannels;
                const color = imgChannels === 3
                    ? new BpxSolidColor(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                    : imgBytes[imgIndex + 3] >= 0xff / 2
                        ? new BpxSolidColor(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                        : transparent_;
                const mappedColor = (_a = colorMapping.get(color.id)) !== null && _a !== void 0 ? _a : color;
                colors[spriteX][spriteY] =
                    mappedColor instanceof BpxSolidColor ? mappedColor : null;
            }
        }
        const preparedSprite = {
            w: sprite.size().x,
            h: sprite.size().y,
            colors: colors,
        };
        __classPrivateFieldGet(this, _PreparedSprites_cache, "f").set(key, preparedSprite);
        return preparedSprite;
    }
}
_PreparedSprites_cache = new WeakMap(), _PreparedSprites_instances = new WeakSet(), _PreparedSprites_keyPortionFromColorMapping = function _PreparedSprites_keyPortionFromColorMapping(colorMapping) {
    return Array.from(colorMapping.entries())
        .map(([fromId, colorTo]) => fromId + ">" + colorTo.id)
        .join(":");
};
