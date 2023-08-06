import { FontAsset } from "../Assets";
import { SolidColor } from "../Color";
import { CharSprite } from "../font/Font";
import { Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
export declare class DrawText {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(text: string, canvasXy1: Vector2d, fontAsset: FontAsset, color: SolidColor | ((charSprite: CharSprite) => SolidColor), clippingRegion?: ClippingRegion | null): void;
}
