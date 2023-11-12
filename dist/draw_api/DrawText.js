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
var _DrawText_canvas, _DrawText_sprite;
import { transparent_ } from "../color/TransparentColor";
import { v_1_1_ } from "../misc/Vector2d";
import { DrawSprite } from "./DrawSprite";
import { BpxFillPattern } from "./FillPattern";
export class DrawText {
    constructor(canvas) {
        _DrawText_canvas.set(this, void 0);
        _DrawText_sprite.set(this, void 0);
        __classPrivateFieldSet(this, _DrawText_canvas, canvas, "f");
        __classPrivateFieldSet(this, _DrawText_sprite, new DrawSprite(__classPrivateFieldGet(this, _DrawText_canvas, "f"), {
            disableRounding: true,
        }), "f");
    }
    
    
    draw(text, canvasXy, fontAsset, color) {
        canvasXy = canvasXy.round();
        const colorFn = typeof color === "function" ? color : () => color;
        for (const charSprite of fontAsset.font.spritesFor(text)) {
            __classPrivateFieldGet(this, _DrawText_sprite, "f").draw(fontAsset.image, charSprite.sprite, canvasXy.add(charSprite.positionInText), v_1_1_, new Map([
                [fontAsset.imageTextColor.id, colorFn(charSprite)],
                [fontAsset.imageBgColor.id, transparent_],
            ]), BpxFillPattern.primaryOnly);
        }
    }
}
_DrawText_canvas = new WeakMap(), _DrawText_sprite = new WeakMap();
