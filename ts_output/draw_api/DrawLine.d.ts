import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
import { FillPattern } from "./FillPattern";
export declare class DrawLine {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(xy1: Vector2d, xy2: Vector2d, color: SolidColor, fillPattern?: FillPattern): void;
}
