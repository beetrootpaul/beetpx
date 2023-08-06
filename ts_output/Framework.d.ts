import { Assets, AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInputEvent } from "./game_input/GameInput";
import { StorageApi } from "./StorageApi";
import { Vector2d } from "./Vector2d";
export type FrameworkOptions = {
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
export type OnAssetsLoaded = {
    startGame: (onStart?: () => void) => void;
};
export declare class Framework {
    #private;
    get debug(): boolean;
    readonly audioApi: AudioApi;
    readonly assets: Assets;
    readonly drawApi: DrawApi;
    readonly storageApi: StorageApi;
    frameNumber: number;
    averageFps: number;
    continuousInputEvents: Set<GameInputEvent>;
    fireOnceInputEvents: Set<GameInputEvent>;
    constructor(options: FrameworkOptions);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded>;
    setOnUpdate(onUpdate: () => void): void;
    setOnDraw(onDraw: () => void): void;
}
