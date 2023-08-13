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
var _DrawApi_assets, _DrawApi_clear, _DrawApi_pixel, _DrawApi_line, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_cameraOffset, _DrawApi_clippingRegion, _DrawApi_fillPattern, _DrawApi_fontAsset, _DrawApi_spriteColorMapping;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawApi = void 0;
const Vector2d_1 = require("../Vector2d");
const DrawClear_1 = require("./DrawClear");
const DrawEllipse_1 = require("./DrawEllipse");
const DrawLine_1 = require("./DrawLine");
const DrawPixel_1 = require("./DrawPixel");
const DrawRect_1 = require("./DrawRect");
const DrawSprite_1 = require("./DrawSprite");
const DrawText_1 = require("./DrawText");
const FillPattern_1 = require("./FillPattern");
// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)
class DrawApi {
    constructor(options) {
        _DrawApi_assets.set(this, void 0);
        _DrawApi_clear.set(this, void 0);
        _DrawApi_pixel.set(this, void 0);
        _DrawApi_line.set(this, void 0);
        _DrawApi_rect.set(this, void 0);
        _DrawApi_ellipse.set(this, void 0);
        _DrawApi_sprite.set(this, void 0);
        _DrawApi_text.set(this, void 0);
        _DrawApi_cameraOffset.set(this, (0, Vector2d_1.v_)(0, 0));
        _DrawApi_clippingRegion.set(this, null);
        _DrawApi_fillPattern.set(this, FillPattern_1.FillPattern.primaryOnly);
        _DrawApi_fontAsset.set(this, null);
        _DrawApi_spriteColorMapping.set(this, new Map());
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear_1.DrawClear(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel_1.DrawPixel(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_line, new DrawLine_1.DrawLine(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect_1.DrawRect(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse_1.DrawEllipse(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite_1.DrawSprite(options.canvasBytes, options.canvasSize.round()), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText_1.DrawText(options.canvasBytes, options.canvasSize.round()), "f");
    }
    // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
    setCameraOffset(offset) {
        __classPrivateFieldSet(this, _DrawApi_cameraOffset, offset.round(), "f");
    }
    setClippingRegion(clippingRegion) {
        __classPrivateFieldSet(this, _DrawApi_clippingRegion, clippingRegion, "f");
    }
    // TODO: cover it with tests
    setFillPattern(fillPattern) {
        __classPrivateFieldSet(this, _DrawApi_fillPattern, fillPattern, "f");
    }
    // TODO: cover it with tests
    mapSpriteColors(mappings) {
        mappings.forEach(({ from, to }) => {
            // TODO: consider writing a custom equality check function
            if (from.id() === to.id()) {
                __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").delete(from.id());
            }
            else {
                __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").set(from.id(), to);
            }
        });
    }
    getMappedSpriteColor(from) {
        return __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f").get(from.id()) ?? from;
    }
    // TODO: cover it with tests
    setFont(fontId) {
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontId ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFontAsset(fontId) : null, "f");
    }
    getFont() {
        return __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")?.font ?? null;
    }
    clearCanvas(color) {
        __classPrivateFieldGet(this, _DrawApi_clear, "f").draw(color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    pixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    line(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_line, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), wh, color, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    rect(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    rectFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    ellipse(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    ellipseFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    // TODO: make sprite make use of fillPattern as well, same as rect and ellipse etc.
    sprite(sprite, canvasXy) {
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sourceImageAsset, sprite, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
    }
    // TODO: cover with tests
    print(text, canvasXy, color) {
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")).round(), __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), color, __classPrivateFieldGet(this, _DrawApi_clippingRegion, "f"));
        }
        else {
            console.info(`print: (${canvasXy.x},${canvasXy.y}) [${typeof color === "function" ? "computed" : color.asRgbCssHex()}] ${text}`);
        }
    }
}
exports.DrawApi = DrawApi;
_DrawApi_assets = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_cameraOffset = new WeakMap(), _DrawApi_clippingRegion = new WeakMap(), _DrawApi_fillPattern = new WeakMap(), _DrawApi_fontAsset = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap();
