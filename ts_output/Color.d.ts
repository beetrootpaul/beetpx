export type ColorId = string;
export interface Color {
    id(): ColorId;
}
export declare class TransparentColor implements Color {
    id(): ColorId;
}
export declare const transparent_: TransparentColor;
export declare class SolidColor implements Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    constructor(r: number, g: number, b: number);
    id(): ColorId;
    asRgbCssHex(): string;
    static fromRgbCssHex(cssHex: string): SolidColor;
}
export declare class CompositeColor implements Color {
    readonly primary: SolidColor | TransparentColor;
    readonly secondary: SolidColor | TransparentColor;
    constructor(primary: SolidColor | TransparentColor, secondary: SolidColor | TransparentColor);
    id(): ColorId;
}
