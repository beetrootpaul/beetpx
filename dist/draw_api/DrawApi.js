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
import { BpxUtils } from "../Utils";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { Logger } from "../logger/Logger";
import { v_, v_1_1_ } from "../misc/Vector2d";
import { BpxPattern } from "./Pattern";
import { DrawClear } from "./drawing/DrawClear";
import { DrawEllipse } from "./drawing/DrawEllipse";
import { DrawLine } from "./drawing/DrawLine";
import { DrawPixel } from "./drawing/DrawPixel";
import { DrawPixels } from "./drawing/DrawPixels";
import { DrawRect } from "./drawing/DrawRect";
import { DrawSprite } from "./drawing/DrawSprite";
import { DrawText } from "./drawing/DrawText";
export class DrawApi {
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
        this.cameraXy = v_(0, 0);
        _DrawApi_pattern.set(this, BpxPattern.primaryOnly);
        _DrawApi_spriteColorMapping.set(this, BpxSpriteColorMapping.noMapping);
        _DrawApi_fontAsset.set(this, null);
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_canvas, options.canvas, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixels, new DrawPixels(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_line, new DrawLine(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText(options.canvas), "f");
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
    pixels(xy, color, pixels) {
        __classPrivateFieldGet(this, _DrawApi_pixels, "f").draw(xy.sub(this.cameraXy), pixels, color, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
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
    sprite(sprite, canvasXy, opts = {}) {
        var _a;
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sourceImageAsset, sprite, canvasXy.sub(this.cameraXy), (_a = opts.scaleXy) !== null && _a !== void 0 ? _a : v_1_1_, __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    setFont(fontId) {
        var _a, _b;
        const prev = (_b = (_a = __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) === null || _a === void 0 ? void 0 : _a.font.id) !== null && _b !== void 0 ? _b : null;
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontId ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFontAsset(fontId) : null, "f");
        return prev;
    }
    getFont() {
        var _a, _b;
        return (_b = (_a = __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) === null || _a === void 0 ? void 0 : _a.font) !== null && _b !== void 0 ? _b : null;
    }
    print(text, canvasXy, color, opts = {}) {
        var _a, _b;
        const centerXy = (_a = opts.centerXy) !== null && _a !== void 0 ? _a : [false, false];
        if (centerXy[0] || centerXy[1]) {
            const size = BpxUtils.measureText(text);
            canvasXy = canvasXy.sub(centerXy[0] ? size.x / 2 : 0, centerXy[1] ? size.y / 2 : 0);
        }
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, canvasXy.sub(this.cameraXy), __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), color, (_b = opts.scaleXy) !== null && _b !== void 0 ? _b : v_1_1_, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
        }
        else {
            Logger.infoBeetPx(`print: (${canvasXy.x},${canvasXy.y}) [${typeof color === "function" ? "computed" : color.cssHex}] ${text}`);
        }
    }
    takeCanvasSnapshot() {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").takeSnapshot();
    }
}
_DrawApi_assets = new WeakMap(), _DrawApi_canvas = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_pixels = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_pattern = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap(), _DrawApi_fontAsset = new WeakMap();
