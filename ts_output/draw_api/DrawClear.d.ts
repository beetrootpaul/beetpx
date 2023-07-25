import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
export declare class DrawClear {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(color: SolidColor): void;
}
