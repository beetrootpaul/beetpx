import { Assets, ImageUrl } from "../Assets";
import { Color, CompositeColor, SolidColor } from "../Color";
import { Font } from "../font/Font";
import { Sprite } from "../Sprite";
import { Xy } from "../Xy";
import { FillPattern } from "./FillPattern";
type DrawApiOptions = {
    canvasBytes: Uint8ClampedArray;
    canvasSize: Xy;
    assets: Assets;
};
export declare class DrawApi {
    #private;
    constructor(options: DrawApiOptions);
    setCameraOffset(offset: Xy): void;
    setFillPattern(fillPattern: FillPattern): void;
    mapSpriteColor(from: Color, to: Color): void;
    setFont(fontImageUrl: string | null): void;
    getFont(): Font | null;
    clear(color: SolidColor): void;
    pixel(xy: Xy, color: SolidColor): void;
    rect(xy1: Xy, xy2: Xy, color: SolidColor): void;
    rectFilled(xy1: Xy, xy2: Xy, color: SolidColor | CompositeColor): void;
    ellipse(xy1: Xy, xy2: Xy, color: SolidColor): void;
    ellipseFilled(xy1: Xy, xy2: Xy, color: SolidColor): void;
    sprite(spriteImageUrl: ImageUrl, sprite: Sprite, canvasXy1: Xy): void;
    print(text: string, canvasXy1: Xy, color: SolidColor): void;
}
export {};
