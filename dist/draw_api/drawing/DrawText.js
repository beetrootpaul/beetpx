"use strict";
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
var _DrawText_canvas, _DrawText_sprite, _DrawText_pixels;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawText = void 0;
const SpriteColorMapping_1 = require("../../color/SpriteColorMapping");
const Vector2d_1 = require("../../misc/Vector2d");
const Sprite_1 = require("../Sprite");
const DrawPixels_1 = require("./DrawPixels");
const DrawSprite_1 = require("./DrawSprite");
class DrawText {
    constructor(canvas) {
        _DrawText_canvas.set(this, void 0);
        _DrawText_sprite.set(this, void 0);
        _DrawText_pixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawText_canvas, canvas, "f");
        __classPrivateFieldSet(this, _DrawText_sprite, new DrawSprite_1.DrawSprite(__classPrivateFieldGet(this, _DrawText_canvas, "f"), {
            disableRounding: true,
        }), "f");
        __classPrivateFieldSet(this, _DrawText_pixels, new DrawPixels_1.DrawPixels(__classPrivateFieldGet(this, _DrawText_canvas, "f"), {
            disableRounding: true,
        }), "f");
    }
    draw(text, fontAsset, canvasXy, color, scaleXy, pattern) {
        canvasXy = canvasXy.round();
        scaleXy = Vector2d_1.BpxVector2d.max(scaleXy.floor(), Vector2d_1.v_0_0_);
        const colorMapping = typeof color === "function"
            ? (charSprite) => new SpriteColorMapping_1.BpxSpriteColorMapping((spriteColor) => spriteColor?.cssHex === fontAsset.spriteTextColor?.cssHex
                ? color(charSprite)
                : null)
            : new SpriteColorMapping_1.BpxSpriteColorMapping((spriteColor) => spriteColor?.cssHex === fontAsset.spriteTextColor?.cssHex
                ? color
                : null);
        for (const charSprite of fontAsset.font.spritesFor(text)) {
            const xy = canvasXy.add(charSprite.positionInText.mul(scaleXy));
            if (charSprite.type === "image") {
                if (fontAsset.font.imageUrl == null) {
                    throw Error(`There is no imageUrl defined for a font "${fontAsset.font.id}", which uses image sprites`);
                }
                if (fontAsset.image == null) {
                    throw Error(`There is no image loaded for a font "${fontAsset.font.id}", which uses image sprites`);
                }
                __classPrivateFieldGet(this, _DrawText_sprite, "f").draw((0, Sprite_1.spr_)(fontAsset.font.imageUrl)(charSprite.spriteXyWh[0].x, charSprite.spriteXyWh[0].y, charSprite.spriteXyWh[1].x, charSprite.spriteXyWh[1].y), fontAsset.image, xy, scaleXy, typeof colorMapping === "function"
                    ? colorMapping(charSprite)
                    : colorMapping, pattern);
            }
            else {
                __classPrivateFieldGet(this, _DrawText_pixels, "f").draw(charSprite.pixels, xy, typeof color === "function" ? color(charSprite) : color, scaleXy, pattern);
            }
        }
    }
}
exports.DrawText = DrawText;
_DrawText_canvas = new WeakMap(), _DrawText_sprite = new WeakMap(), _DrawText_pixels = new WeakMap();
