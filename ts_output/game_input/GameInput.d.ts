export type GameInputEvent = null | "left" | "right" | "up" | "down" | "mute_unmute_toggle" | "full_screen" | "debug_toggle";
export declare const gameInputEventBehavior: Record<string, {
    fireOnce?: boolean;
}>;
type GameInputParams = {
    muteButtonsSelector: string;
    fullScreenButtonsSelector: string;
    debugToggleKey?: string;
};
export declare class GameInput {
    #private;
    constructor(params: GameInputParams);
    startListening(): void;
    getCurrentContinuousEvents(): Set<GameInputEvent>;
    consumeFireOnceEvents(): Set<GameInputEvent>;
}
export {};
