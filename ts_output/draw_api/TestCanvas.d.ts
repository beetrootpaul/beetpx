import { SolidColor } from "../Color";
import { Xy } from "../Xy";
export declare class TestCanvas {
    #private;
    readonly size: Xy;
    readonly bytes: Uint8ClampedArray;
    constructor(width: number, height: number, color: SolidColor);
    expectToEqual(params: {
        withMapping: Record<string, SolidColor>;
        expectedImageAsAscii: string;
    }): void;
}
