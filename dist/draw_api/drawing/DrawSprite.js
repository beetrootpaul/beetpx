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
var _DrawSprite_preparedSprites, _DrawSprite_canvas, _DrawSprite_options;
import { BpxVector2d } from "../../misc/Vector2d";
import { v_, v_0_0_ } from "../../shorthands";
import { PreparedSprites } from "../PreparedSprites";
export class DrawSprite {
    constructor(canvas, options = {}) {
        _DrawSprite_preparedSprites.set(this, new PreparedSprites());
        _DrawSprite_canvas.set(this, void 0);
        _DrawSprite_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawSprite_canvas, canvas, "f");
        __classPrivateFieldSet(this, _DrawSprite_options, options, "f");
    }
    draw(sprite, sourceImageAsset, targetXy, scaleXy, colorMapping, pattern) {
        targetXy = __classPrivateFieldGet(this, _DrawSprite_options, "f").disableRounding ? targetXy : targetXy.round();
        scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);
        const { width: imgW, height: imgH, channels: imgChannels, rgba8bitData: imgBytes, } = sourceImageAsset;
        sprite = sprite.clipBy(v_0_0_, v_(imgW, imgH));
        
        if (!__classPrivateFieldGet(this, _DrawSprite_canvas, "f").canSetAny(targetXy.x, targetXy.y, targetXy.x + sprite.size.x * scaleXy.x - 1, targetXy.y + sprite.size.y * scaleXy.y - 1)) {
            return;
        }
        const preparedSprite = __classPrivateFieldGet(this, _DrawSprite_preparedSprites, "f").prepareOrGetFromCache(sprite, imgBytes, imgW, imgChannels);
        for (let spriteY = 0; spriteY < preparedSprite.h; spriteY += 1) {
            const canvasYBase = targetXy.y + spriteY * scaleXy.y;
            for (let spriteX = 0; spriteX < preparedSprite.w; spriteX += 1) {
                const canvasXBase = targetXy.x + spriteX * scaleXy.x;
                for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
                    for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
                        const canvasX = canvasXBase + xScaledStep;
                        const canvasY = canvasYBase + yScaledStep;
                        if (__classPrivateFieldGet(this, _DrawSprite_canvas, "f").canSetAt(canvasX, canvasY)) {
                            if (pattern.hasPrimaryColorAt(canvasX, canvasY)) {
                                const color = preparedSprite.colors[spriteX][spriteY];
                                if (color) {
                                    const mappedColor = colorMapping.getMappedColor(color);
                                    if (mappedColor) {
                                        __classPrivateFieldGet(this, _DrawSprite_canvas, "f").set(mappedColor, canvasX, canvasY);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
_DrawSprite_preparedSprites = new WeakMap(), _DrawSprite_canvas = new WeakMap(), _DrawSprite_options = new WeakMap();
