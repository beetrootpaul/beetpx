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
var _DrawPixels_canvas, _DrawPixels_options;
import { BpxVector2d } from "../../misc/Vector2d";
import { v_0_0_ } from "../../shorthands";
export class DrawPixels {
    constructor(canvas, options = {}) {
        _DrawPixels_canvas.set(this, void 0);
        _DrawPixels_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixels_canvas, canvas, "f");
        __classPrivateFieldSet(this, _DrawPixels_options, options, "f");
    }
    draw(pixels, targetXy, color, scaleXy, flipXy, pattern) {
        targetXy = __classPrivateFieldGet(this, _DrawPixels_options, "f").disableRounding ? targetXy : targetXy.round();
        scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);
        for (let bitsY = 0; bitsY < pixels.asciiRows.length; bitsY += 1) {
            const yBase = targetXy.y +
                (flipXy[1] ? pixels.size.y - 1 - bitsY : bitsY) * scaleXy.y;
            for (let bitsX = 0; bitsX < pixels.asciiRows[bitsY].length; bitsX += 1) {
                const xBase = targetXy.x +
                    (flipXy[0] ? pixels.size.x - 1 - bitsX : bitsX) * scaleXy.x;
                if (pixels.asciiRows[bitsY][bitsX] !== "#") {
                    continue;
                }
                for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
                    for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
                        const y = yBase + yScaledStep;
                        const x = xBase + xScaledStep;
                        if (pattern.hasPrimaryColorAt(x, y)) {
                            if (__classPrivateFieldGet(this, _DrawPixels_canvas, "f").canSetAt(x, y)) {
                                __classPrivateFieldGet(this, _DrawPixels_canvas, "f").set(color, x, y);
                            }
                        }
                    }
                }
            }
        }
    }
}
_DrawPixels_canvas = new WeakMap(), _DrawPixels_options = new WeakMap();
