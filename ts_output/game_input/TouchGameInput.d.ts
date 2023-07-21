import { GameInputEvent } from "./GameInput";
export declare class TouchGameInput {
    #private;
    constructor();
    startListening(): void;
    getCurrentContinuousEvents(): Set<GameInputEvent>;
}
