export type GameLoopCallbacks = {
    updateFn: (frameNumber: number) => void;
    renderFn: () => void;
};
type GameLoopOptions = {
    desiredFps: number;
    logActualFps?: boolean;
    requestAnimationFrameFn: AnimationFrameProvider["requestAnimationFrame"];
};
export declare class GameLoop {
    #private;
    constructor(options: GameLoopOptions);
    start(callbacks: GameLoopCallbacks): void;
}
export {};
