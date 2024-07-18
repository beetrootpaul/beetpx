import { BpxRgbColor } from "../color/RgbColor";
export class CanvasSnapshotForProduction {
    #imageDataData;
    constructor(imageDataData) {
        this.#imageDataData = imageDataData;
    }
    getColorAtIndex(index) {
        if (index >= this.#imageDataData.length / 4) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${this.#imageDataData.length / 4 - 1}`);
        }
        const dataIndex = index * 4;
        return BpxRgbColor.of(this.#imageDataData[dataIndex], this.#imageDataData[dataIndex + 1], this.#imageDataData[dataIndex + 2]);
    }
}
