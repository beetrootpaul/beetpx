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
var _DrawPixels_canvas;
export class DrawPixels {
    constructor(canvas) {
        _DrawPixels_canvas.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixels_canvas, canvas, "f");
    }
    draw(xy, pixels, color, pattern) {
        xy = xy.round();
        for (let bitsY = 0; bitsY < pixels.asciiRows.length; bitsY += 1) {
            for (let bitsX = 0; bitsX < pixels.asciiRows[bitsY].length; bitsX += 1) {
                if (pixels.asciiRows[bitsY][bitsX] !== "#") {
                    continue;
                }
                const x = xy.x + bitsX;
                const y = xy.y + bitsY;
                if (pattern.hasPrimaryColorAt(x, y)) {
                    if (__classPrivateFieldGet(this, _DrawPixels_canvas, "f").canSetAt(x, y)) {
                        __classPrivateFieldGet(this, _DrawPixels_canvas, "f").set(color, x, y);
                    }
                }
            }
        }
    }
}
_DrawPixels_canvas = new WeakMap();
