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
var _DrawSprite_canvasBytes, _DrawSprite_canvasSize, _DrawSprite_pixel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawSprite = void 0;
const Color_1 = require("../Color");
const Sprite_1 = require("../Sprite");
const Utils_1 = require("../Utils");
const Vector2d_1 = require("../Vector2d");
const DrawPixel_1 = require("./DrawPixel");
class DrawSprite {
    constructor(canvasBytes, canvasSize) {
        _DrawSprite_canvasBytes.set(this, void 0);
        _DrawSprite_canvasSize.set(this, void 0);
        _DrawSprite_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawSprite_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawSprite_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawSprite_pixel, new DrawPixel_1.DrawPixel(__classPrivateFieldGet(this, _DrawSprite_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawSprite_canvasSize, "f")), "f");
    }
    draw(sourceImageAsset, sprite, targetXy1, colorMapping = new Map()) {
        const { width: imgW, height: imgH, rgba8bitData: imgBytes, } = sourceImageAsset;
        // make sure xy1 is top-left and xy2 is bottom right
        sprite = (0, Sprite_1.spr_)(Math.min(sprite.xy1.x, sprite.xy2.x), Math.min(sprite.xy1.y, sprite.xy2.y), Math.max(sprite.xy1.x, sprite.xy2.x), Math.max(sprite.xy1.y, sprite.xy2.y));
        // clip sprite by image edges
        sprite = (0, Sprite_1.spr_)(Utils_1.Utils.clamp(0, sprite.xy1.x, imgW), Utils_1.Utils.clamp(0, sprite.xy1.y, imgH), Utils_1.Utils.clamp(0, sprite.xy2.x, imgW), Utils_1.Utils.clamp(0, sprite.xy2.y, imgH));
        for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
            for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
                const imgBytesIndex = (imgY * imgW + imgX) * 4;
                if (imgBytes.length < imgBytesIndex + 4) {
                    throw Error(`DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`);
                }
                let color = imgBytes[imgBytesIndex + 3] > 0xff / 2
                    ? new Color_1.SolidColor(imgBytes[imgBytesIndex], imgBytes[imgBytesIndex + 1], imgBytes[imgBytesIndex + 2])
                    : Color_1.transparent;
                color = colorMapping.get(color.id()) ?? color;
                if (color instanceof Color_1.SolidColor) {
                    const canvasXy = targetXy1.add((0, Vector2d_1.v_)(imgX - sprite.xy1.x, imgY - sprite.xy1.y));
                    __classPrivateFieldGet(this, _DrawSprite_pixel, "f").draw(canvasXy, color);
                }
            }
        }
    }
}
exports.DrawSprite = DrawSprite;
_DrawSprite_canvasBytes = new WeakMap(), _DrawSprite_canvasSize = new WeakMap(), _DrawSprite_pixel = new WeakMap();
