var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TestCanvas_instances, _TestCanvas_asAscii;
import { expect } from "@jest/globals";
import { BpxSolidColor } from "../Color";
import { v_ } from "../Vector2d";
export class TestCanvas {
    constructor(width, height, color) {
        _TestCanvas_instances.add(this);
        this.size = v_(width, height);
        this.bytes = new Uint8ClampedArray(4 * width * height);
        for (let i = 0; i < width * height; i += 1) {
            this.bytes[4 * i] = color.r;
            this.bytes[4 * i + 1] = color.g;
            this.bytes[4 * i + 2] = color.b;
            this.bytes[4 * i + 3] = 0xff;
        }
    }
    expectToEqual(params) {
        // first, let's check if bytes didn't increase in their length
        expect(this.bytes.length).toEqual(this.size.x * this.size.y * 4);
        // then, let's proceed to the actual image check
        const { withMapping: asciiToColor, expectedImageAsAscii } = params;
        const colorToAscii = new Map(Object.entries(asciiToColor).map(([ascii, color]) => [color.id, ascii]));
        const actualAscii = __classPrivateFieldGet(this, _TestCanvas_instances, "m", _TestCanvas_asAscii).call(this, colorToAscii);
        const expectedAscii = params.expectedImageAsAscii
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
    for (let y = 0; y < this.size.y; y += 1) {
        for (let x = 0; x < this.size.x; x += 1) {
            const i = 4 * (y * this.size.x + x);
            const colorBytes = this.bytes.slice(i, i + 4);
            if (colorBytes[3] !== 0xff) {
                asciiImage += "!";
            }
            else {
                const color = new BpxSolidColor(colorBytes[0], colorBytes[1], colorBytes[2]);
                asciiImage += (_a = colorToAscii.get(color.id)) !== null && _a !== void 0 ? _a : "?";
            }
        }
        asciiImage += "\n";
    }
    return asciiImage
        .split("\n")
        .map((line) => line.split("").join(" "))
        .join("\n");
};
