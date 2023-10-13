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
import { v2d_, v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";
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
    draw(sourceImageAsset, sprite, targetXy, 
    // TODO: test it
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy = [1, 1], colorMapping = new Map(), 
    // TODO: test it
    fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        targetXy = __classPrivateFieldGet(this, _DrawSprite_options, "f").disableRounding ? targetXy : v_.round(targetXy);
        scaleXy = v_.floor(scaleXy);
        const { width: imgW, height: imgH, rgba8bitData: imgBytes, } = sourceImageAsset;
        // make sure xy1 is top-left and xy2 is bottom right
        sprite = new BpxSprite(sprite.imageUrl, v2d_(Math.min(sprite.xy1[0], sprite.xy2[0]), Math.min(sprite.xy1[1], sprite.xy2[1])), v2d_(Math.max(sprite.xy1[0], sprite.xy2[0]), Math.max(sprite.xy1[1], sprite.xy2[1])));
        // clip sprite by image edges
        sprite = new BpxSprite(sprite.imageUrl, v2d_(BpxUtils.clamp(0, sprite.xy1[0], imgW), BpxUtils.clamp(0, sprite.xy1[1], imgH)), v2d_(BpxUtils.clamp(0, sprite.xy2[0], imgW), BpxUtils.clamp(0, sprite.xy2[1], imgH)));
        for (let imgY = sprite.xy1[1]; imgY < sprite.xy2[1]; imgY += 1) {
            for (let imgX = sprite.xy1[0]; imgX < sprite.xy2[0]; imgX += 1) {
                BpxUtils.repeatN(scaleXy[0], (xScaledStep) => {
                    BpxUtils.repeatN(scaleXy[1], (yScaledStep) => {
                        var _a;
                        const canvasXy = v_.add(targetXy, v_.add(v_.mul(v2d_(imgX - sprite.xy1[0], imgY - sprite.xy1[1]), scaleXy), v2d_(xScaledStep, yScaledStep)));
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
                        __classPrivateFieldGet(this, _DrawSprite_pixel, "f").draw(canvasXy, color, clippingRegion, fillPattern);
                    });
                });
            }
        }
    }
}
_DrawSprite_canvasBytes = new WeakMap(), _DrawSprite_canvasSize = new WeakMap(), _DrawSprite_options = new WeakMap(), _DrawSprite_pixel = new WeakMap();
