import { Assets, ImageUrl } from "../Assets";
import { Color, CompositeColor, SolidColor } from "../Color";
import { CharSprite, Font } from "../font/Font";
import { Sprite } from "../Sprite";
import { Vector2d } from "../Vector2d";
import { FillPattern } from "./FillPattern";
type DrawApiOptions = {
    canvasBytes: Uint8ClampedArray;
    canvasSize: Vector2d;
    assets: Assets;
};
export declare class DrawApi {
    #private;
    constructor(options: DrawApiOptions);
    setCameraOffset(offset: Vector2d): void;
    setFillPattern(fillPattern: FillPattern): void;
    mapSpriteColors(mappings: Array<{
        from: Color;
        to: Color;
    }>): void;
    setFont(fontImageUrl: string | null): void;
    getFont(): Font | null;
    clearCanvas(color: SolidColor): void;
    pixel(xy: Vector2d, color: SolidColor): void;
    rect(xy1: Vector2d, xy2: Vector2d, color: SolidColor): void;
    rectFilled(xy1: Vector2d, xy2: Vector2d, color: SolidColor | CompositeColor): void;
    ellipse(xy1: Vector2d, xy2: Vector2d, color: SolidColor): void;
    ellipseFilled(xy1: Vector2d, xy2: Vector2d, color: SolidColor): void;
    sprite(spriteImageUrl: ImageUrl, sprite: Sprite, canvasXy1: Vector2d): void;
    print(text: string, canvasXy1: Vector2d, color: SolidColor | ((charSprite: CharSprite) => SolidColor)): void;
}
export {};
