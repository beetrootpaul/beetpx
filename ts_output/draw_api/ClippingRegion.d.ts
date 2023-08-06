import { Vector2d } from "../Vector2d";
export declare class ClippingRegion {
    #private;
    static of(xy1: Vector2d, xy2: Vector2d): ClippingRegion;
    private constructor();
    allowsDrawingAt(xy: Vector2d): boolean;
}
