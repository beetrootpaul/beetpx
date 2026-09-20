import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { $font_pico8, $rgb_white, $v, $v_1_1 } from "../shorthands";
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
    #assets;
    #canvas;
    #clear;
    #pixel;
    #pixels;
    #line;
    #rect;
    #ellipse;
    #sprite;
    #text;
    cameraXy = $v(0, 0);
    #pattern = BpxDrawingPattern.primaryOnly;
    #spriteColorMapping = BpxSpriteColorMapping.noMapping;
    #font = $font_pico8;
    #textColorMarkers = {};
    constructor(options) {
        this.#assets = options.assets;
        this.#canvas = options.canvas;
        this.#clear = new DrawClear(options.canvas);
        this.#pixel = new DrawPixel(options.canvas);
        this.#pixels = new DrawPixels(options.canvas);
        this.#line = new DrawLine(options.canvas);
        this.#rect = new DrawRect(options.canvas);
        this.#ellipse = new DrawEllipse(options.canvas);
        this.#sprite = new DrawSprite(options.canvas);
        this.#text = new DrawText(options.canvas, options.assets);
    }
    clearCanvas(color) {
        this.#clear.draw(color);
    }
    setClippingRegion(xy, wh) {
        return this.#canvas.setClippingRegion(xy, wh);
    }
    removeClippingRegion() {
        return this.#canvas.removeClippingRegion();
    }
    getCameraXy() {
        return this.cameraXy;
    }
    setCameraXy(xy) {
        const prev = this.cameraXy;
        this.cameraXy = xy;
        return prev;
    }
    setDrawingPattern(pattern) {
        const prev = this.#pattern;
        this.#pattern = pattern;
        return prev;
    }
    drawPixel(xy, color) {
        this.#pixel.draw(xy.sub(this.cameraXy), color, this.#pattern);
    }
    drawPixels(pixels, xy, color, opts) {
        const centerXy = opts?.centerXy ?? [false, false];
        if (centerXy[0] || centerXy[1]) {
            xy = xy.sub(centerXy[0] ? (pixels.size.x * (opts?.scaleXy?.x ?? 1)) / 2 : 0, centerXy[1] ? (pixels.size.y * (opts?.scaleXy?.y ?? 1)) / 2 : 0);
        }
        this.#pixels.draw(pixels, xy.sub(this.cameraXy), color, opts?.scaleXy ?? $v_1_1, opts?.flipXy ?? [false, false], this.#pattern);
    }
    drawLine(xy, wh, color) {
        this.#line.draw(xy.sub(this.cameraXy), wh, color, this.#pattern);
    }
    drawRect(xy, wh, color) {
        this.#rect.draw(xy.sub(this.cameraXy), wh, color, "none", this.#pattern);
    }
    drawRectFilled(xy, wh, color) {
        this.#rect.draw(xy.sub(this.cameraXy), wh, color, "inside", this.#pattern);
    }
    drawRectOutsideFilled(xy, wh, color) {
        this.#rect.draw(xy.sub(this.cameraXy), wh, color, "outside", this.#pattern);
    }
    drawEllipse(xy, wh, color) {
        this.#ellipse.draw(xy.sub(this.cameraXy), wh, color, "none", this.#pattern);
    }
    drawEllipseFilled(xy, wh, color) {
        this.#ellipse.draw(xy.sub(this.cameraXy), wh, color, "inside", this.#pattern);
    }
    drawEllipseOutsideFilled(xy, wh, color) {
        this.#ellipse.draw(xy.sub(this.cameraXy), wh, color, "outside", this.#pattern);
    }
    setSpriteColorMapping(spriteColorMapping) {
        const prev = this.#spriteColorMapping;
        this.#spriteColorMapping = spriteColorMapping;
        return prev;
    }
    drawSprite(sprite, xy, opts) {
        const centerXy = opts?.centerXy ?? [false, false];
        if (centerXy[0] || centerXy[1]) {
            xy = xy.sub(centerXy[0] ? (sprite.size.x * (opts?.scaleXy?.x ?? 1)) / 2 : 0, centerXy[1] ? (sprite.size.y * (opts?.scaleXy?.y ?? 1)) / 2 : 0);
        }
        const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
        this.#sprite.draw(sprite.type === "static" ? sprite : sprite.current, sourceImageAsset, xy.sub(this.cameraXy), opts?.scaleXy ?? $v_1_1, opts?.flipXy ?? [false, false], this.#spriteColorMapping, this.#pattern);
    }
    setFont(font) {
        const prev = this.#font;
        this.#font = font;
        return prev;
    }
    setTextColorMarkers(textColorMarkers) {
        const prev = this.#textColorMarkers;
        this.#textColorMarkers = textColorMarkers;
        return prev;
    }
    measureText(text, opts) {
        let maxLineNumber = 0;
        let maxX = 0;
        for (const arrangedGlyph of this.#font.arrangeGlyphsFor(text, $rgb_white, this.#textColorMarkers)) {
            if (arrangedGlyph.type === "line_break") {
                maxLineNumber = Math.max(maxLineNumber, arrangedGlyph.lineNumber + 1);
            }
            else {
                maxLineNumber = Math.max(maxLineNumber, arrangedGlyph.lineNumber);
                maxX = Math.max(maxX, arrangedGlyph.leftTop.x +
                    (arrangedGlyph.type === "sprite"
                        ? arrangedGlyph.sprite.size.x
                        : arrangedGlyph.pixels.size.x));
            }
        }
        const wh = $v(maxX, (maxLineNumber + 1) * (this.#font.ascent + this.#font.descent) +
            maxLineNumber * this.#font.lineGap).mul(opts?.scaleXy ?? $v_1_1);
        const offset = $v(opts?.centerXy?.[0] ? -wh.x / 2 : 0, opts?.centerXy?.[1] ? -wh.y / 2 : 0);
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
        this.#text.draw(text, this.#font, xy.sub(this.cameraXy), color, this.#textColorMarkers, opts?.scaleXy ?? $v_1_1, this.#pattern);
    }
    takeCanvasSnapshot() {
        return this.#canvas.takeSnapshot();
    }
}
//# sourceMappingURL=DrawApi.js.map