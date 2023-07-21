import { FontAsset } from "../Assets";
import { SolidColor } from "../Color";
import { Xy } from "../Xy";
export declare class DrawText {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy);
    draw(text: string, canvasXy1: Xy, fontAsset: FontAsset, color: SolidColor): void;
}
