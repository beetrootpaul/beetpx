import { CompositeColor, SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { FillPattern } from "./FillPattern";
export declare class DrawRect {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(xy1: Vector2d, xy2: Vector2d, color: SolidColor | CompositeColor, fill: boolean, fillPattern?: FillPattern, clippingRegion?: ClippingRegion | null): void;
}
