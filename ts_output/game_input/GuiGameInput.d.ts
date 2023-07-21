import { GameInputEvent } from "./GameInput";
type GuiGameInputParams = {
    muteButtonsSelector: string;
    fullScreenButtonsSelector: string;
};
export declare class GuiGameInput {
    #private;
    constructor(params: GuiGameInputParams);
    startListening(): void;
    getCurrentContinuousEvents(): Set<GameInputEvent>;
    consumeFireOnceEvents(): Set<GameInputEvent>;
}
export {};
