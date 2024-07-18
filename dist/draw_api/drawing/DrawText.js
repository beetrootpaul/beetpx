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
var _DrawText_canvas, _DrawText_assets, _DrawText_sprite, _DrawText_pixels;
import { BpxVector2d } from "../../misc/Vector2d";
import { v_0_0_ } from "../../shorthands";
import { assertUnreachable } from "../../utils/assertUnreachable";
import { DrawPixels } from "./DrawPixels";
import { DrawSprite } from "./DrawSprite";
export class DrawText {
    constructor(canvas, assets) {
        _DrawText_canvas.set(this, void 0);
        _DrawText_assets.set(this, void 0);
        _DrawText_sprite.set(this, void 0);
        _DrawText_pixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawText_canvas, canvas, "f");
        __classPrivateFieldSet(this, _DrawText_assets, assets, "f");
        __classPrivateFieldSet(this, _DrawText_sprite, new DrawSprite(__classPrivateFieldGet(this, _DrawText_canvas, "f"), {
            disableRounding: true,
        }), "f");
        __classPrivateFieldSet(this, _DrawText_pixels, new DrawPixels(__classPrivateFieldGet(this, _DrawText_canvas, "f"), {
            disableRounding: true,
        }), "f");
    }
    draw(text, font, canvasXy, color, colorMarkers, scaleXy, pattern) {
        canvasXy = canvasXy.round();
        scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);
        for (const arrangedGlyph of font.arrangeGlyphsFor(text, color, colorMarkers)) {
            if (arrangedGlyph.type === "line_break")
                continue;
            const xy = canvasXy.add(arrangedGlyph.leftTop.mul(scaleXy));
            if (arrangedGlyph.type === "sprite") {
                __classPrivateFieldGet(this, _DrawText_sprite, "f").draw(arrangedGlyph.sprite, __classPrivateFieldGet(this, _DrawText_assets, "f").getImageAsset(arrangedGlyph.sprite.imageUrl), xy, scaleXy, [false, false], arrangedGlyph.spriteColorMapping, pattern);
            }
            else if (arrangedGlyph.type === "pixels") {
                __classPrivateFieldGet(this, _DrawText_pixels, "f").draw(arrangedGlyph.pixels, xy, arrangedGlyph.color, scaleXy, [false, false], pattern);
            }
            else {
                assertUnreachable(arrangedGlyph);
            }
        }
    }
}
_DrawText_canvas = new WeakMap(), _DrawText_assets = new WeakMap(), _DrawText_sprite = new WeakMap(), _DrawText_pixels = new WeakMap();
