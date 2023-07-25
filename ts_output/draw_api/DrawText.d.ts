import { FontAsset } from "../Assets";
import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
export declare class DrawText {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(text: string, canvasXy1: Vector2d, fontAsset: FontAsset, color: SolidColor): void;
}
