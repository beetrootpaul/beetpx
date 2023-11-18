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
    draw(xy, ascii, color, pattern) {
        xy = xy.round();
        const asciiRows = ascii
            .split("\n")
            .map((row) => row.replace(/\s/g, ""))
            .filter((row) => row.length > 0);
        for (const row of asciiRows) {
            const indexOfUnexpectedChar = row.search(/[^#-]/);
            if (indexOfUnexpectedChar >= 0) {
                throw Error(`DrawPixels.draw: Unexpected character found: "${row[indexOfUnexpectedChar]}"`);
            }
        }
        for (let bitsY = 0; bitsY < asciiRows.length; bitsY += 1) {
            for (let bitsX = 0; bitsX < asciiRows[bitsY].length; bitsX += 1) {
                if (asciiRows[bitsY][bitsX] !== "#") {
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
