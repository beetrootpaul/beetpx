import { GameInputEvent } from "./GameInput";
export declare class GamepadGameInput {
    #private;
    readonly buttonMapping: Map<number, GameInputEvent>;
    readonly axisThreshold: number;
    getCurrentContinuousEvents(): Set<GameInputEvent>;
}
