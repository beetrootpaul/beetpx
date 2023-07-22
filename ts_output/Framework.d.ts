import { AssetsToLoad } from "./Assets";
import { SolidColor } from "./Color";
import { Vector2d } from "./Vector2d";
export type FrameworkOptions = {
    htmlCanvasBackground: SolidColor;
    gameCanvasSize: Vector2d;
    desiredFps: number;
    logActualFps?: boolean;
    debug?: {
        enabledOnInit: boolean;
        /**
         * A key to toggle debug mode on/off. Has to match a
         * [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
         * of a desired key.
         */
        toggleKey?: string;
    };
};
export declare class Framework {
    #private;
    get debug(): boolean;
    constructor(options: FrameworkOptions);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<{
        startGame: (onStart?: () => void) => void;
    }>;
    setOnUpdate(onUpdate: () => void): void;
    setOnDraw(onDraw: () => void): void;
}
