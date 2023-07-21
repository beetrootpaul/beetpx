import { AssetsToLoad } from "./Assets";
import { Audio } from "./audio/Audio";
import { DrawApi } from "./draw_api/DrawApi";
import { type FrameworkOptions } from "./Framework";
import { GameInputEvent } from "./game_input/GameInput";
import { StorageApi } from "./StorageApi";
export declare class BeetPx {
    #private;
    static init(frameworkOptions: FrameworkOptions, assetsToLoad: AssetsToLoad): Promise<{
        startGame: (onStart?: () => void) => void;
    }>;
    static setOnUpdate(onUpdate: () => void): void;
    static setOnDraw(onDraw: () => void): void;
    static frameNumber: number;
    static averageFps: number;
    static drawApi: DrawApi;
    static audio: Audio;
    static continuousInputEvents: Set<GameInputEvent>;
    static fireOnceInputEvents: Set<GameInputEvent>;
    static storageApi: StorageApi;
    static get debug(): boolean;
}
