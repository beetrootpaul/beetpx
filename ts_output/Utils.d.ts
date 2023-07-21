import { SolidColor } from "./Color";
import { Xy } from "./Xy";
export declare class Utils {
    static clamp(a: number, b: number, c: number): number;
    static booleanChangingEveryNthFrame(n: number): boolean;
    static get offset8Directions(): Xy[];
    static measureTextSize(text: string): Xy;
    static printWithOutline(text: string, canvasXy1: Xy, textColor: SolidColor, outlineColor: SolidColor): void;
    static throwError(message: string): never;
}
