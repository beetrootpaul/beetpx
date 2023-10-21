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
var _DrawApi_assets, _DrawApi_clear, _DrawApi_pixel, _DrawApi_pixels, _DrawApi_line, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_cameraOffset, _DrawApi_clippingRegion, _DrawApi_fillPattern, _DrawApi_fontAsset, _DrawApi_spriteColorMapping;
import { Logger } from "../logger/Logger";
import { BpxUtils } from "../Utils";
import { v_, v_1_1_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawPixels } from "./DrawPixels";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { BpxFillPattern } from "./FillPattern";
// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)
// TODO: tests for float rounding: different shapes and sprites drawn for same coords should be aligned visually, not off by 1.
//       It's especially about cases where we should round xy+wh instead of xy first and then wh separately.
export class DrawApi {
    constructor(options) {
        _DrawApi_assets.set(this, void 0);
        _DrawApi_clear.set(this, void 0);
        _DrawApi_pixel.set(this, void 0);
        _DrawApi_pixels.set(this, void 0);
        _DrawApi_line.set(this, void 0);
        _DrawApi_rect.set(this, void 0);
        _DrawApi_ellipse.set(this, void 0);
        _DrawApi_sprite.set(this, void 0);
        _DrawApi_text.set(this, void 0);
        _DrawApi_cameraOffset.set(this, v_(0, 0));
        _DrawApi_clippingRegion.set(this, null);
        _DrawApi_fillPattern.set(this, BpxFillPattern.primaryOnly);
        _DrawApi_fontAsset.set(this, null);
        _DrawApi_spriteColorMapping.set(this, new Map());
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_pixels, new DrawPixels(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_line, new DrawLine(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite(options.canvasBytes, options.canvasSize), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText(options.canvasBytes, options.canvasSize), "f");
        this.takeCanvasSnapshot = () => ({
            canvasBytes: new Uint8ClampedArray(options.canvasBytes),
        });
    }
    // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
    // TODO: consider returning the previous offset
    setCameraOffset(offset) {
        __classPrivateFieldSet(this, _DrawApi_cameraOffset, offset, "f");
    }
    setClippingRegion(xy, wh) {
        __classPrivateFieldSet(this, _DrawApi_clippingRegion, new BpxClippingRegion(xy, wh), "f");
    }
    removeClippingRegion() {
        __classPrivateFieldSet(this, _DrawApi_clippingRegion, null, "f");
    }
    // TODO: rename it? "fill" suggests it would apply to filled shapes only, but we apply it to contours as well
    // TODO: cover it with tests
    setFillPattern(fillPattern) {
        __classPrivateFieldSet(this, _DrawApi_fillPattern, fillPattern, "f");
    }
    // TODO: rename to `setSpriteColorMapping`?
    // TODO: make it more clear this fn is additive and `mapSpriteColor([])` does NOT reset the current mapping
    // TODO: super confusing: 1) prevMapping = mapSpriteColors(…) 2) mapSpriteColors(other) 3) mapSpriteColors(prevMapping) DOES NOT reset 2nd call
    // TODO: ability to remove all mappings
    // TODO: cover it with tests
    mapSpriteColors(mapping) {
        const previous = [];
        mapping.forEach(({ from, to }) => {
            var _a;
            previous.push({
                from,
                to: (_a = __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").get(from.id)) !== null && _a !== void 0 ? _a : from,
            });
            // TODO: consider writing a custom equality check function
            if (from.id === to.id) {
                __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").delete(from.id);
            }
            else {
                __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").set(from.id, to);
            }
        });
        return previous;
    }
    // TODO: cover it with tests
    setFont(fontId) {
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontId ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFontAsset(fontId) : null, "f");
    }
    getFont() {
        var _a, _b;
        return (_b = (_a = __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) === null || _a === void 0 ? void 0 : _a.font) !== null && _b !== void 0 ? _b : null;
    }
    clearCanvas(color) {
        __classPrivateFieldGet(this, _DrawApi_clear, "f").draw(color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    pixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    // bits = an array representing rows from top to bottom, where each array element
    //        is a text sequence of `0` and `1` to represent drawn and skipped pixels
    //        from left to right.
    pixels(xy, color, bits) {
        __classPrivateFieldGet(this, _DrawApi_pixels, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), bits, color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    line(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_line, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    rect(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    rectFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    ellipse(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    ellipseFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    // TODO: make sprite make use of fillPattern as well?
    sprite(sprite, canvasXy, scaleXy = v_1_1_) {
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sourceImageAsset, sprite, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), scaleXy, __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    // TODO: cover with tests
    print(text, canvasXy, color, centerXy = [false, false]) {
        if (centerXy[0] || centerXy[1]) {
            const size = BpxUtils.measureText(text);
            canvasXy = canvasXy.sub(centerXy[0] ? size.x / 2 : 0, centerXy[1] ? size.y / 2 : 0);
        }
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
        }
        else {
            Logger.infoBeetPx(`print: (${canvasXy.x},${canvasXy.y}) [${typeof color === "function" ? "computed" : color.asRgbCssHex()}] ${text}`);
        }
    }
}
_DrawApi_assets = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_pixels = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_cameraOffset = new WeakMap(), _DrawApi_clippingRegion = new WeakMap(), _DrawApi_fillPattern = new WeakMap(), _DrawApi_fontAsset = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap();
