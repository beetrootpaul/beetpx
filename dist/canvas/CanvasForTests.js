import { expect } from "vitest";
import { BpxVector2d } from "../misc/Vector2d";
import { range } from "../utils/range";
import { Canvas } from "./Canvas";
import { CanvasSnapshotForTests } from "./CanvasSnapshotForTests";
export class CanvasForTests extends Canvas {
    #length;
    #width;
    #rgbValues;
    constructor(width, height, initialColor) {
        super(BpxVector2d.of(width, height));
        this.#length = width * height;
        this.#width = width;
        this.#rgbValues = range(this.#length).map(() => (initialColor.r << 16) + (initialColor.g << 8) + initialColor.b);
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= this.#length) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${this.#length - 1}`);
        }
        this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    newSnapshot() {
        return new CanvasSnapshotForTests(this.#rgbValues.slice(), this.#width);
    }
    doRender() { }
    asDataUrl() {
        return "-";
    }
    expectToEqual(params) {
        const { withMapping: asciiToColor, expectedImageAsAscii } = params;
        const colorToAscii = new Map(Object.entries(asciiToColor).map(([ascii, color]) => [
            color.cssHex,
            ascii,
        ]));
        const actualAscii = this.#asAscii(colorToAscii);
        const expectedAscii = expectedImageAsAscii
            .trim()
            .split("\n")
            .map(line => line
            .trim()
            .split("")
            .filter(char => char !== " ")
            .join(" "))
            .filter(line => line.length > 0)
            .join("\n") + "\n";
        expect(actualAscii).toEqual(expectedAscii);
    }
    #asAscii(colorToAscii) {
        let asciiImage = "";
        const snapshot = new CanvasSnapshotForTests(this.#rgbValues.slice(), this.canvasSize.x);
        for (let y = 0; y < this.canvasSize.y; y += 1) {
            for (let x = 0; x < this.canvasSize.x; x += 1) {
                const color = snapshot.getColorAt(x, y);
                asciiImage += colorToAscii.get(color.cssHex) ?? "?";
            }
            asciiImage += "\n";
        }
        return asciiImage
            .split("\n")
            .map(line => line.split("").join(" "))
            .join("\n");
    }
}
//# sourceMappingURL=CanvasForTests.js.map