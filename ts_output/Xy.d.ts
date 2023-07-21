import { PrintDebug } from "./debug/PrintDebug";
export declare function xy_(x: number, y: number): Xy;
export declare class Xy implements PrintDebug {
    static zero: Xy;
    static min(xy1: Xy, xy2: Xy): Xy;
    static max(xy1: Xy, xy2: Xy): Xy;
    static forEachIntXyWithinRectOf(xy1: Xy, xy2: Xy, fill: boolean, callback: (xy: Xy) => void): void;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    magnitude(): number;
    abs(): Xy;
    floor(): Xy;
    round(): Xy;
    eq(other: Xy): boolean;
    gt(other: Xy): boolean;
    gte(other: Xy): boolean;
    lt(other: Xy): boolean;
    lte(other: Xy): boolean;
    clamp(xy1: Xy, xy2: Xy): Xy;
    mod(other: Xy | number): Xy;
    add(other: Xy | number): Xy;
    sub(other: Xy | number): Xy;
    mul(other: Xy | number): Xy;
    div(other: Xy | number): Xy;
    d(): string;
}
