import { Xy } from "./Xy";
export declare function spr_(x1: number, y1: number, x2: number, y2: number): Sprite;
export declare class Sprite {
    xy1: Xy;
    xy2: Xy;
    constructor(xy1: Xy, xy2: Xy);
    size(): Xy;
}
