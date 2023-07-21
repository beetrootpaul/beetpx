import { SolidColor } from "../Color";
import { Xy } from "../Xy";
export declare class DrawClear {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy);
    draw(color: SolidColor): void;
}
