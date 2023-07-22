import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
export declare class TestCanvas {
    #private;
    readonly size: Vector2d;
    readonly bytes: Uint8ClampedArray;
    constructor(width: number, height: number, color: SolidColor);
    expectToEqual(params: {
        withMapping: Record<string, SolidColor>;
        expectedImageAsAscii: string;
    }): void;
}
