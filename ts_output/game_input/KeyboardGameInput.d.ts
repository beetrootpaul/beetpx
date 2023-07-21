import { GameInputEvent } from "./GameInput";
type KeyboardGameInputParams = {
    debugToggleKey?: string;
};
export declare class KeyboardGameInput {
    #private;
    constructor(params: KeyboardGameInputParams);
    startListening(): void;
    getCurrentContinuousEvents(): Set<GameInputEvent>;
    consumeFireOnceEvents(): Set<GameInputEvent>;
}
export {};
