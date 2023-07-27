import { SolidColor } from "./Color";
import { Vector2d } from "./Vector2d";
export declare class Utils {
    static clamp(a: number, b: number, c: number): number;
    static repeatN(n: number, callback: (i: number) => void): void;
    static booleanChangingEveryNthFrame(n: number): boolean;
    static get offset8Directions(): Vector2d[];
    static measureTextSize(text: string): Vector2d;
    static printWithOutline(text: string, canvasXy1: Vector2d, textColor: SolidColor, outlineColor: SolidColor): void;
    static throwError(message: string): never;
}
