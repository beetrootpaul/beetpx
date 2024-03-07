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
var _CanvasForTests_instances, _CanvasForTests_length, _CanvasForTests_rgbValues, _CanvasForTests_asAscii;
import { expect } from "vitest";
import { BpxVector2d } from "../misc/Vector2d";
import { range } from "../utils/range";
import { Canvas } from "./Canvas";
import { CanvasSnapshotForTests } from "./CanvasSnapshotForTests";
export class CanvasForTests extends Canvas {
    constructor(width, height, initialColor) {
        super(BpxVector2d.of(width, height));
        _CanvasForTests_instances.add(this);
        _CanvasForTests_length.set(this, void 0);
        _CanvasForTests_rgbValues.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasForTests_length, width * height, "f");
        __classPrivateFieldSet(this, _CanvasForTests_rgbValues, range(__classPrivateFieldGet(this, _CanvasForTests_length, "f")).map(() => (initialColor.r << 16) + (initialColor.g << 8) + initialColor.b), "f");
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasForTests_length, "f")) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasForTests_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasForTests_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    newSnapshot() {
        return new CanvasSnapshotForTests(__classPrivateFieldGet(this, _CanvasForTests_rgbValues, "f").slice());
    }
    doRender() { }
    expectToEqual(params) {
        const { withMapping: asciiToColor, expectedImageAsAscii } = params;
        const colorToAscii = new Map(Object.entries(asciiToColor).map(([ascii, color]) => [
            color.cssHex,
            ascii,
        ]));
        const actualAscii = __classPrivateFieldGet(this, _CanvasForTests_instances, "m", _CanvasForTests_asAscii).call(this, colorToAscii);
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
_CanvasForTests_length = new WeakMap(), _CanvasForTests_rgbValues = new WeakMap(), _CanvasForTests_instances = new WeakSet(), _CanvasForTests_asAscii = function _CanvasForTests_asAscii(colorToAscii) {
    let asciiImage = "";
    const snapshot = new CanvasSnapshotForTests(__classPrivateFieldGet(this, _CanvasForTests_rgbValues, "f").slice());
    for (let y = 0; y < this.canvasSize.y; y += 1) {
        for (let x = 0; x < this.canvasSize.x; x += 1) {
            const index = y * this.canvasSize.x + x;
            const color = snapshot.getColorAtIndex(index);
            asciiImage += colorToAscii.get(color.cssHex) ?? "?";
        }
        asciiImage += "\n";
    }
    return asciiImage
        .split("\n")
        .map((line) => line.split("").join(" "))
        .join("\n");
};
