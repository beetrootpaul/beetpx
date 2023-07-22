import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
export declare class DrawPixel {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(xy: Vector2d, color: SolidColor): void;
}
