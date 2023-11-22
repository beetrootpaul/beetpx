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
var _DrawApi_assets, _DrawApi_canvas, _DrawApi_clear, _DrawApi_pixel, _DrawApi_pixels, _DrawApi_line, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_pattern, _DrawApi_spriteColorMapping, _DrawApi_fontAsset;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawApi = void 0;
const Utils_1 = require("../Utils");
const SpriteColorMapping_1 = require("../color/SpriteColorMapping");
const Logger_1 = require("../logger/Logger");
const Vector2d_1 = require("../misc/Vector2d");
const Pattern_1 = require("./Pattern");
const DrawClear_1 = require("./drawing/DrawClear");
const DrawEllipse_1 = require("./drawing/DrawEllipse");
const DrawLine_1 = require("./drawing/DrawLine");
const DrawPixel_1 = require("./drawing/DrawPixel");
const DrawPixels_1 = require("./drawing/DrawPixels");
const DrawRect_1 = require("./drawing/DrawRect");
const DrawSprite_1 = require("./drawing/DrawSprite");
const DrawText_1 = require("./drawing/DrawText");
class DrawApi {
    constructor(options) {
        _DrawApi_assets.set(this, void 0);
        _DrawApi_canvas.set(this, void 0);
        _DrawApi_clear.set(this, void 0);
        _DrawApi_pixel.set(this, void 0);
        _DrawApi_pixels.set(this, void 0);
        _DrawApi_line.set(this, void 0);
        _DrawApi_rect.set(this, void 0);
        _DrawApi_ellipse.set(this, void 0);
        _DrawApi_sprite.set(this, void 0);
        _DrawApi_text.set(this, void 0);
        this.cameraXy = (0, Vector2d_1.v_)(0, 0);
        _DrawApi_pattern.set(this, Pattern_1.BpxPattern.primaryOnly);
        _DrawApi_spriteColorMapping.set(this, SpriteColorMapping_1.BpxSpriteColorMapping.noMapping);
        _DrawApi_fontAsset.set(this, null);
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_canvas, options.canvas, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear_1.DrawClear(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel_1.DrawPixel(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixels, new DrawPixels_1.DrawPixels(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_line, new DrawLine_1.DrawLine(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect_1.DrawRect(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse_1.DrawEllipse(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite_1.DrawSprite(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText_1.DrawText(options.canvas), "f");
    }
    clearCanvas(color) {
        __classPrivateFieldGet(this, _DrawApi_clear, "f").draw(color);
    }
    setClippingRegion(xy, wh) {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").setClippingRegion(xy, wh);
    }
    removeClippingRegion() {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").removeClippingRegion();
    }
    setCameraXy(xy) {
        const prev = this.cameraXy;
        this.cameraXy = xy;
        return prev;
    }
    setPattern(pattern) {
        const prev = __classPrivateFieldGet(this, _DrawApi_pattern, "f");
        __classPrivateFieldSet(this, _DrawApi_pattern, pattern, "f");
        return prev;
    }
    pixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(this.cameraXy), color, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    pixels(pixels, xy, color, opts = {}) {
        __classPrivateFieldGet(this, _DrawApi_pixels, "f").draw(pixels, xy.sub(this.cameraXy), color, opts.scaleXy ?? Vector2d_1.v_1_1_, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    line(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_line, "f").draw(xy.sub(this.cameraXy), wh, color, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    rect(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(this.cameraXy), wh, color, false, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    rectFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(this.cameraXy), wh, color, true, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    ellipse(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(this.cameraXy), wh, color, false, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    ellipseFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(this.cameraXy), wh, color, true, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    setSpriteColorMapping(spriteColorMapping) {
        const prev = __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f");
        __classPrivateFieldSet(this, _DrawApi_spriteColorMapping, spriteColorMapping, "f");
        return prev;
    }
    sprite(sprite, xy, opts = {}) {
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sprite, sourceImageAsset, xy.sub(this.cameraXy), opts.scaleXy ?? Vector2d_1.v_1_1_, __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    setFont(fontId) {
        const prev = __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")?.font.id ?? null;
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontId ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFontAsset(fontId) : null, "f");
        return prev;
    }
    getFont() {
        return __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")?.font ?? null;
    }
    print(text, xy, color, opts = {}) {
        const centerXy = opts.centerXy ?? [false, false];
        if (centerXy[0] || centerXy[1]) {
            const [_, size] = Utils_1.BpxUtils.measureText(text);
            xy = xy.sub(centerXy[0] ? size.x / 2 : 0, centerXy[1] ? size.y / 2 : 0);
        }
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), xy.sub(this.cameraXy), color, opts.scaleXy ?? Vector2d_1.v_1_1_, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
        }
        else {
            Logger_1.Logger.infoBeetPx(`print: (${xy.x},${xy.y}) [${typeof color === "function" ? "computed" : color.cssHex}] ${text}`);
        }
    }
    takeCanvasSnapshot() {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").takeSnapshot();
    }
}
exports.DrawApi = DrawApi;
_DrawApi_assets = new WeakMap(), _DrawApi_canvas = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_pixels = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_pattern = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap(), _DrawApi_fontAsset = new WeakMap();
