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
var _DrawText_canvasPixels, _DrawText_sprite;
import { transparent_, } from "../Color";
import { v_1_1_ } from "../Vector2d";
import { DrawSprite } from "./DrawSprite";
import { BpxFillPattern } from "./FillPattern";
export class DrawText {
    constructor(canvasPixels) {
        _DrawText_canvasPixels.set(this, void 0);
        _DrawText_sprite.set(this, void 0);
        __classPrivateFieldSet(this, _DrawText_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawText_sprite, new DrawSprite(__classPrivateFieldGet(this, _DrawText_canvasPixels, "f"), {
            disableRounding: true,
        }), "f");
    }
    // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
    // TODO: cover ClippingRegion with tests
    draw(text, canvasXy, fontAsset, color, clippingRegion = null) {
        canvasXy = canvasXy.round();
        const colorFn = typeof color === "function" ? color : () => color;
        for (const charSprite of fontAsset.font.spritesFor(text)) {
            __classPrivateFieldGet(this, _DrawText_sprite, "f").draw(fontAsset.image, charSprite.sprite, canvasXy.add(charSprite.positionInText), v_1_1_, new Map([
                [fontAsset.imageTextColor.id, colorFn(charSprite)],
                [fontAsset.imageBgColor.id, transparent_],
            ]), BpxFillPattern.primaryOnly, clippingRegion);
        }
    }
}
_DrawText_canvasPixels = new WeakMap(), _DrawText_sprite = new WeakMap();
