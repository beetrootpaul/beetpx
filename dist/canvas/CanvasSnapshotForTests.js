import { BpxRgbColor } from "../color/RgbColor";
export class CanvasSnapshotForTests {
    #rgbValues;
    #canvasWidth;
    constructor(rgbValues, canvasWidth) {
        this.#rgbValues = rgbValues;
        this.#canvasWidth = canvasWidth;
    }
    getColorAt(x, y) {
        const index = y * this.#canvasWidth + x;
        if (index >= this.#rgbValues.length) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${this.#rgbValues.length - 1}`);
        }
        const value = this.#rgbValues[index];
        return BpxRgbColor.of((value & 0xff0000) >> 16, (value & 0x00ff00) >> 8, value & 0x0000ff);
    }
}
//# sourceMappingURL=CanvasSnapshotForTests.js.map