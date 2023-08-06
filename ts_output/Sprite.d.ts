import { Vector2d } from "./Vector2d";
export declare function spr_(x1: number, y1: number, wh: Vector2d): Sprite;
export declare function spr_(x1: number, y1: number, w: number, h: number): Sprite;
export declare class Sprite {
    xy1: Vector2d;
    xy2: Vector2d;
    constructor(xy1: Vector2d, xy2: Vector2d);
    size(): Vector2d;
}
