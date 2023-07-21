import { ImageAsset } from "../Assets";
import { type Color } from "../Color";
export declare class TestImage {
    readonly asset: ImageAsset;
    constructor(params: {
        image: string;
        withMapping: Record<string, Color>;
    });
}
