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
var _DrawApi_assets, _DrawApi_canvas, _DrawApi_clear, _DrawApi_pixel, _DrawApi_pixels, _DrawApi_line, _DrawApi_rect, _DrawApi_ellipse, _DrawApi_sprite, _DrawApi_text, _DrawApi_cameraOffset, _DrawApi_fillPattern, _DrawApi_spriteColorMapping, _DrawApi_fontAsset;
import { BpxUtils } from "../Utils";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { Logger } from "../logger/Logger";
import { v_, v_1_1_ } from "../misc/Vector2d";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawPixels } from "./DrawPixels";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { BpxFillPattern } from "./FillPattern";



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
        _DrawApi_cameraOffset.set(this, v_(0, 0));
        _DrawApi_fillPattern.set(this, BpxFillPattern.primaryOnly);
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
    
    
    setCameraOffset(offset) {
        __classPrivateFieldSet(this, _DrawApi_cameraOffset, offset, "f");
    }
    setClippingRegion(xy, wh) {
        __classPrivateFieldGet(this, _DrawApi_canvas, "f").setClippingRegion(xy, wh);
    }
    removeClippingRegion() {
        __classPrivateFieldGet(this, _DrawApi_canvas, "f").removeClippingRegion();
    }
    
    
    setFillPattern(fillPattern) {
        __classPrivateFieldSet(this, _DrawApi_fillPattern, fillPattern, "f");
    }
    setSpriteColorMapping(spriteColorMapping) {
        const prevMapping = __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f");
        __classPrivateFieldSet(this, _DrawApi_spriteColorMapping, spriteColorMapping, "f");
        return prevMapping;
    }
    clearCanvas(color) {
        __classPrivateFieldGet(this, _DrawApi_clear, "f").draw(color);
    }
    pixel(xy, color) {
        __classPrivateFieldGet(this, _DrawApi_pixel, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), color, BpxFillPattern.primaryOnly);
    }
    
    
    
    pixels(xy, color, bits) {
        __classPrivateFieldGet(this, _DrawApi_pixels, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), bits, color);
    }
    line(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_line, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    rect(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    rectFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_rect, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    ellipse(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, false, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    ellipseFilled(xy, wh, color) {
        __classPrivateFieldGet(this, _DrawApi_ellipse, "f").draw(xy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), wh, color, true, __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    
    sprite(sprite, canvasXy, 
    
    scaleXy = v_1_1_) {
        const sourceImageAsset = __classPrivateFieldGet(this, _DrawApi_assets, "f").getImageAsset(sprite.imageUrl);
        __classPrivateFieldGet(this, _DrawApi_sprite, "f").draw(sourceImageAsset, sprite, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), scaleXy, __classPrivateFieldGet(this, _DrawApi_spriteColorMapping, "f"), __classPrivateFieldGet(this, _DrawApi_fillPattern, "f"));
    }
    
    setFont(fontId) {
        __classPrivateFieldSet(this, _DrawApi_fontAsset, fontId ? __classPrivateFieldGet(this, _DrawApi_assets, "f").getFontAsset(fontId) : null, "f");
    }
    getFont() {
        var _a, _b;
        return (_b = (_a = __classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) === null || _a === void 0 ? void 0 : _a.font) !== null && _b !== void 0 ? _b : null;
    }
    
    print(text, canvasXy, color, centerXy = [false, false], 
    
    scaleXy = v_1_1_) {
        if (centerXy[0] || centerXy[1]) {
            const size = BpxUtils.measureText(text);
            canvasXy = canvasXy.sub(centerXy[0] ? size.x / 2 : 0, centerXy[1] ? size.y / 2 : 0);
        }
        if (__classPrivateFieldGet(this, _DrawApi_fontAsset, "f")) {
            __classPrivateFieldGet(this, _DrawApi_text, "f").draw(text, canvasXy.sub(__classPrivateFieldGet(this, _DrawApi_cameraOffset, "f")), __classPrivateFieldGet(this, _DrawApi_fontAsset, "f"), color, scaleXy);
        }
        else {
            Logger.infoBeetPx(`print: (${canvasXy.x},${canvasXy.y}) [${typeof color === "function" ? "computed" : color.asRgbCssHex()}] ${text}`);
        }
    }
    takeCanvasSnapshot() {
        return __classPrivateFieldGet(this, _DrawApi_canvas, "f").takeSnapshot();
    }
}
_DrawApi_assets = new WeakMap(), _DrawApi_canvas = new WeakMap(), _DrawApi_clear = new WeakMap(), _DrawApi_pixel = new WeakMap(), _DrawApi_pixels = new WeakMap(), _DrawApi_line = new WeakMap(), _DrawApi_rect = new WeakMap(), _DrawApi_ellipse = new WeakMap(), _DrawApi_sprite = new WeakMap(), _DrawApi_text = new WeakMap(), _DrawApi_cameraOffset = new WeakMap(), _DrawApi_fillPattern = new WeakMap(), _DrawApi_spriteColorMapping = new WeakMap(), _DrawApi_fontAsset = new WeakMap();
