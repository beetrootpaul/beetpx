import { PrintDebug } from "./debug/PrintDebug";
export declare function v_(x: number, y: number): Vector2d;
export declare class Vector2d implements PrintDebug {
    static zero: Vector2d;
    static min(xy1: Vector2d, xy2: Vector2d): Vector2d;
    static max(xy1: Vector2d, xy2: Vector2d): Vector2d;
    static forEachIntXyWithinRectOf(xy1: Vector2d, xy2: Vector2d, fill: boolean, callback: (xy: Vector2d) => void): void;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    magnitude(): number;
    abs(): Vector2d;
    floor(): Vector2d;
    round(): Vector2d;
    eq(other: Vector2d): boolean;
    gt(other: Vector2d): boolean;
    gte(other: Vector2d): boolean;
    lt(other: Vector2d): boolean;
    lte(other: Vector2d): boolean;
    clamp(xy1: Vector2d, xy2: Vector2d): Vector2d;
    mod(other: Vector2d | number): Vector2d;
    add(other: Vector2d | number): Vector2d;
    sub(other: Vector2d | number): Vector2d;
    mul(other: Vector2d | number): Vector2d;
    div(other: Vector2d | number): Vector2d;
    d(): string;
}
