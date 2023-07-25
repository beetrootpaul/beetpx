import { ImageAsset } from "../Assets";
import { type Color, ColorId } from "../Color";
import { Sprite } from "../Sprite";
import { Vector2d } from "../Vector2d";
export declare class DrawSprite {
    #private;
    constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d);
    draw(sourceImageAsset: ImageAsset, sprite: Sprite, targetXy1: Vector2d, colorMapping?: Map<ColorId, Color>): void;
}
