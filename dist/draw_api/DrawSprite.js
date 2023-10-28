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
var _a, _DrawSprite_preparedSprites, _DrawSprite_canvasPixels, _DrawSprite_options;
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { v_, v_1_1_ } from "../Vector2d";
import { BpxFillPattern } from "./FillPattern";
import { PreparedSprites } from "./PreparedSprites";
export class DrawSprite {
    constructor(canvasPixels, options = {}) {
        _DrawSprite_canvasPixels.set(this, void 0);
        _DrawSprite_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawSprite_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawSprite_options, options, "f");
    }
    // TODO: Investigate why colors recognized by color picked in WebStorm on PNG are different from those drawn:
    //       - ff614f became ff6e59
    //       - 00555a became 125359
    // TODO: cover clippingRegion with tests
    draw(sourceImageAsset, sprite, targetXy, 
    // TODO: test it
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy = v_1_1_, colorMapping = new Map(), 
    // TODO: test it
    fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        targetXy = __classPrivateFieldGet(this, _DrawSprite_options, "f").disableRounding ? targetXy : targetXy.round();
        scaleXy = scaleXy.floor();
        const { width: imgW, height: imgH, rgba8bitData: imgBytes, } = sourceImageAsset;
        // make sure xy1 is top-left and xy2 is bottom right
        sprite = new BpxSprite(sprite.imageUrl, v_(Math.min(sprite.xy1.x, sprite.xy2.x), Math.min(sprite.xy1.y, sprite.xy2.y)), v_(Math.max(sprite.xy1.x, sprite.xy2.x), Math.max(sprite.xy1.y, sprite.xy2.y)));
        // clip sprite by image edges
        sprite = new BpxSprite(sprite.imageUrl, v_(BpxUtils.clamp(0, sprite.xy1.x, imgW), BpxUtils.clamp(0, sprite.xy1.y, imgH)), v_(BpxUtils.clamp(0, sprite.xy2.x, imgW), BpxUtils.clamp(0, sprite.xy2.y, imgH)));
        // avoid all computations if the whole sprite is outside the canvas
        if (targetXy.x + sprite.size().x * scaleXy.x < 0 ||
            targetXy.y + sprite.size().y * scaleXy.y < 0 ||
            targetXy.x >= __classPrivateFieldGet(this, _DrawSprite_canvasPixels, "f").canvasSize.x ||
            targetXy.y >= __classPrivateFieldGet(this, _DrawSprite_canvasPixels, "f").canvasSize.y) {
            return;
        }
        const preparedSprite = __classPrivateFieldGet(DrawSprite, _a, "f", _DrawSprite_preparedSprites).prepareOrGetFromCache(sprite, imgBytes, imgW, colorMapping);
        for (let spriteY = 0; spriteY < preparedSprite.h; spriteY += 1) {
            const canvasYBase = targetXy.y + spriteY * scaleXy.y;
            for (let spriteX = 0; spriteX < preparedSprite.w; spriteX += 1) {
                const canvasXBase = targetXy.x + spriteX * scaleXy.x;
                for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
                    for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
                        const canvasX = canvasXBase + xScaledStep;
                        const canvasY = canvasYBase + yScaledStep;
                        if (__classPrivateFieldGet(this, _DrawSprite_canvasPixels, "f").canSetAt(canvasX, canvasY)) {
                            if (!clippingRegion ||
                                clippingRegion.allowsDrawingAt(canvasX, canvasY)) {
                                if (fillPattern.hasPrimaryColorAt(canvasX, canvasY)) {
                                    const color = preparedSprite.colors[spriteX][spriteY];
                                    if (color) {
                                        __classPrivateFieldGet(this, _DrawSprite_canvasPixels, "f").set(color, canvasX, canvasY);
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
_a = DrawSprite, _DrawSprite_canvasPixels = new WeakMap(), _DrawSprite_options = new WeakMap();
_DrawSprite_preparedSprites = { value: new PreparedSprites() };
