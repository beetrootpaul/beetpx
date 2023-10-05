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
var _DrawSprite_canvasBytes, _DrawSprite_canvasSize, _DrawSprite_options, _DrawSprite_pixel;
import { BpxSolidColor, transparent_, } from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
export class DrawSprite {
    constructor(canvasBytes, canvasSize, options = {}) {
        _DrawSprite_canvasBytes.set(this, void 0);
        _DrawSprite_canvasSize.set(this, void 0);
        _DrawSprite_options.set(this, void 0);
        _DrawSprite_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawSprite_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawSprite_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawSprite_options, options, "f");
        __classPrivateFieldSet(this, _DrawSprite_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawSprite_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawSprite_canvasSize, "f")), "f");
    }
    // TODO: cover clippingRegion with tests
    draw(sourceImageAsset, sprite, targetXy, colorMapping = new Map(), clippingRegion = null) {
        var _a;
        targetXy = __classPrivateFieldGet(this, _DrawSprite_options, "f").disableRounding ? targetXy : targetXy.round();
        const { width: imgW, height: imgH, rgba8bitData: imgBytes, } = sourceImageAsset;
        // make sure xy1 is top-left and xy2 is bottom right
        sprite = new BpxSprite(sprite.imageUrl, v_(Math.min(sprite.xy1.x, sprite.xy2.x), Math.min(sprite.xy1.y, sprite.xy2.y)), v_(Math.max(sprite.xy1.x, sprite.xy2.x), Math.max(sprite.xy1.y, sprite.xy2.y)));
        // clip sprite by image edges
        sprite = new BpxSprite(sprite.imageUrl, v_(BpxUtils.clamp(0, sprite.xy1.x, imgW), BpxUtils.clamp(0, sprite.xy1.y, imgH)), v_(BpxUtils.clamp(0, sprite.xy2.x, imgW), BpxUtils.clamp(0, sprite.xy2.y, imgH)));
        for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
            for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
                const canvasXy = targetXy.add(v_(imgX - sprite.xy1.x, imgY - sprite.xy1.y));
                if (clippingRegion && !clippingRegion.allowsDrawingAt(canvasXy)) {
                    continue;
                }
                const imgBytesIndex = (imgY * imgW + imgX) * 4;
                if (imgBytes.length < imgBytesIndex + 4) {
                    throw Error(`DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`);
                }
                let color = imgBytes[imgBytesIndex + 3] >= 0xff / 2
                    ? new BpxSolidColor(imgBytes[imgBytesIndex], imgBytes[imgBytesIndex + 1], imgBytes[imgBytesIndex + 2])
                    : transparent_;
                color = (_a = colorMapping.get(color.id)) !== null && _a !== void 0 ? _a : color;
                // TODO: Investigate why colors recognized by color picked in WebStorm on PNG are different from those drawn:
                //       - ff614f became ff6e59
                //       - 00555a became 125359
                __classPrivateFieldGet(this, _DrawSprite_pixel, "f").draw(canvasXy, color);
            }
        }
    }
}
_DrawSprite_canvasBytes = new WeakMap(), _DrawSprite_canvasSize = new WeakMap(), _DrawSprite_options = new WeakMap(), _DrawSprite_pixel = new WeakMap();
