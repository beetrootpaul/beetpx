import { CompositeColor, SolidColor } from "../Color";
import { Xy } from "../Xy";
import { FillPattern } from "./FillPattern";
export declare class DrawRect {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy);
    draw(xy1: Xy, xy2: Xy, color: SolidColor | CompositeColor, fill: boolean, fillPattern?: FillPattern): void;
}
