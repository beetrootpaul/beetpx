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
var _DrawApi_assets, _DrawApi_canvas, _DrawApi_clear, _DrawApi_pixel, _DrawApi_pixels, _DrawApi_line, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_pattern, _DrawApi_spriteColorMapping, _DrawApi_font;
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { font_pico8_, rgb_white_, v_, v_1_1_ } from "../shorthands";
import { DrawClear } from "./drawing/DrawClear";
import { DrawEllipse } from "./drawing/DrawEllipse";
import { DrawLine } from "./drawing/DrawLine";
import { DrawPixel } from "./drawing/DrawPixel";
import { DrawPixels } from "./drawing/DrawPixels";
import { DrawRect } from "./drawing/DrawRect";
import { DrawSprite } from "./drawing/DrawSprite";
import { DrawText } from "./drawing/DrawText";
import { BpxDrawingPattern } from "./DrawingPattern";
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
        _DrawApi_pattern.set(this, BpxDrawingPattern.primaryOnly);
        _DrawApi_spriteColorMapping.set(this, BpxSpriteColorMapping.noMapping);
        _DrawApi_font.set(this, font_pico8_);
        __classPrivateFieldSet(this, _DrawApi_assets, options.assets, "f");
        __classPrivateFieldSet(this, _DrawApi_canvas, options.canvas, "f");
        __classPrivateFieldSet(this, _DrawApi_clear, new DrawClear(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixel, new DrawPixel(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_pixels, new DrawPixels(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_line, new DrawLine(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_rect, new DrawRect(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_ellipse, new DrawEllipse(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_sprite, new DrawSprite(options.canvas), "f");
        __classPrivateFieldSet(this, _DrawApi_text, new DrawText(options.canvas, options.assets), "f");
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
    setDrawingPattern(pattern) {
        const prev = __classPrivateFieldGet(this, _DrawApi_pattern, "f");
        __classPrivateFieldSet(this, _DrawApi_pattern, pattern, "f");
        return prev;
    }
    drawPixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(this.cameraXy), color, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawPixels(pixels, xy, color, opts) {
        __classPrivateFieldGet(this, _DrawApi_pixels, "f").draw(pixels, xy.sub(this.cameraXy), color, opts?.scaleXy ?? v_1_1_, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawLine(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_line, "f").draw(xy.sub(this.cameraXy), wh, color, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawRect(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(this.cameraXy), wh, color, false, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawRectFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(this.cameraXy), wh, color, true, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawEllipse(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(this.cameraXy), wh, color, false, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    drawEllipseFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(this.cameraXy), wh, color, true, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    setSpriteColorMapping(spriteColorMapping) {
        const prev = __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f");
        __classPrivateFieldSet(this, _DrawApi_spriteColorMapping, spriteColorMapping, "f");
        return prev;
    }
    drawSprite(sprite, xy, opts) {
        const centerXy = opts?.centerXy ?? [false, false];
        if (centerXy[0] || centerXy[1]) {
            xy = xy.sub(centerXy[0] ? sprite.size.x / 2 : 0, centerXy[1] ? sprite.size.y / 2 : 0);
        }
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sprite.type === "static" ? sprite : sprite.current, sourceImageAsset, xy.sub(this.cameraXy), opts?.scaleXy ?? v_1_1_, __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    useFont(font) {
        const prev = __classPrivateFieldGet(this, _DrawApi_font, "f");
        __classPrivateFieldSet(this, _DrawApi_font, font, "f");
        return prev;
    }
    measureText(text, opts) {
        let maxLineNumber = 0;
        let maxX = 0;
        for (const arrangedGlyph of __classPrivateFieldGet(this, _DrawApi_font, "f").arrangeGlyphsFor(text, rgb_white_)) {
            maxLineNumber = Math.max(maxLineNumber, arrangedGlyph.lineNumber);
            maxX = Math.max(maxX, arrangedGlyph.leftTop.x +
                (arrangedGlyph.type === "sprite"
                    ? arrangedGlyph.sprite.size.x
                    : arrangedGlyph.pixels.size.x));
        }
        const wh = v_(maxX, (maxLineNumber + 1) * (__classPrivateFieldGet(this, _DrawApi_font, "f").ascent + __classPrivateFieldGet(this, _DrawApi_font, "f").descent) +
            maxLineNumber * __classPrivateFieldGet(this, _DrawApi_font, "f").lineGap).mul(opts?.scaleXy ?? v_1_1_);
        const offset = v_(opts?.centerXy?.[0] ? -wh.x / 2 : 0, opts?.centerXy?.[1] ? -wh.y / 2 : 0);
        return { wh, offset };
    }
    drawText(text, xy, color, opts) {
        const centerXy = opts?.centerXy ?? [false, false];
        if (centerXy[0] || centerXy[1]) {
            const { offset } = this.measureText(text, {
                scaleXy: opts?.scaleXy,
                centerXy: opts?.centerXy,
            });
            xy = xy.add(offset);
        }
        __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, __classPrivateFieldGet(this, _DrawApi_font, "f"), xy.sub(this.cameraXy), color, opts?.colorMarkers ?? {}, opts?.scaleXy ?? v_1_1_, __classPrivateFieldGet(this, _DrawApi_pattern, "f"));
    }
    takeCanvasSnapshot() {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").takeSnapshot();
    }
}
_DrawApi_assets = new WeakMap(), _DrawApi_canvas = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_pixels = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_pattern = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap(), _DrawApi_font = new WeakMap();
