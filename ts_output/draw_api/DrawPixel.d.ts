import { SolidColor } from "../Color";
import { Xy } from "../Xy";
export declare class DrawPixel {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy);
    draw(xy: Xy, color: SolidColor): void;
}
