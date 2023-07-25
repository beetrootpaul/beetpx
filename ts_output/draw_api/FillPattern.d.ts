import { Vector2d } from "../Vector2d";
export declare class FillPattern {
    #private;
    static of(bits: number): FillPattern;
    static primaryOnly: FillPattern;
    static secondaryOnly: FillPattern;
    private constructor();
    hasPrimaryColorAt(xy: Vector2d): boolean;
}
