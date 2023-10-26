import { BpxSolidColor } from "../../Color";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";
export class CanvasPixelsWebGl2 extends CanvasPixels {
    constructor(canvasSize) {
        super(canvasSize);
    }
    set(index, color) {
        // TODO: ???
    }
    get(index) {
        // TODO: ???
        return BpxSolidColor.fromRgbCssHex("#012345");
    }
    takeSnapshot() {
        // TODO: ???
        return new CanvasPixelsWebGl2Snapshot();
    }
    render() {
        // TODO: ???
    }
}
