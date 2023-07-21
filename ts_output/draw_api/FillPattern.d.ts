import { Xy } from "../Xy";
export declare class FillPattern {
    #private;
    static of(bits: number): FillPattern;
    static primaryOnly: FillPattern;
    static secondaryOnly: FillPattern;
    private constructor();
    hasPrimaryColorAt(xy: Xy): boolean;
}
