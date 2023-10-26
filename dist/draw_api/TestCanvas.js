var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TestCanvas_instances, _TestCanvas_asAscii;
import { expect } from "@jest/globals";
import { v_ } from "../Vector2d";
import { CanvasPixelsNoRender } from "./canvas_pixels/CanvasPixelsNoRender";
export class TestCanvas {
    constructor(width, height, color) {
        _TestCanvas_instances.add(this);
        this.pixels = new CanvasPixelsNoRender(v_(width, height));
        for (let i = 0; i < width * height; i += 1) {
            this.pixels.set(i, color);
        }
    }
    expectToEqual(params) {
        const { withMapping: asciiToColor, expectedImageAsAscii } = params;
        const colorToAscii = new Map(Object.entries(asciiToColor).map(([ascii, color]) => [color.id, ascii]));
        const actualAscii = __classPrivateFieldGet(this, _TestCanvas_instances, "m", _TestCanvas_asAscii).call(this, colorToAscii);
        const expectedAscii = expectedImageAsAscii
            .trim()
            .split("\n")
            .map((line) => line
            .trim()
            .split("")
            .filter((char) => char !== " ")
            .join(" "))
            .filter((line) => line.length > 0)
            .join("\n") + "\n";
        expect(actualAscii).toEqual(expectedAscii);
    }
}
_TestCanvas_instances = new WeakSet(), _TestCanvas_asAscii = function _TestCanvas_asAscii(colorToAscii) {
    var _a;
    let asciiImage = "";
    const snapshot = this.pixels.takeSnapshot();
    for (let y = 0; y < this.pixels.canvasSize.y; y += 1) {
        for (let x = 0; x < this.pixels.canvasSize.x; x += 1) {
            const index = y * this.pixels.canvasSize.x + x;
            const color = snapshot.get(index);
            asciiImage += (_a = colorToAscii.get(color.id)) !== null && _a !== void 0 ? _a : "?";
        }
        asciiImage += "\n";
    }
    return asciiImage
        .split("\n")
        .map((line) => line.split("").join(" "))
        .join("\n");
};
