import { ImageAsset } from "../Assets";
import { type Color, ColorId } from "../Color";
import { Sprite } from "../Sprite";
import { Xy } from "../Xy";
export declare class DrawSprite {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy);
    draw(sourceImageAsset: ImageAsset, sprite: Sprite, targetXy1: Xy, colorMapping?: Map<ColorId, Color>): void;
}
