import { BpxGameInputEvent, GameInputMethod } from "./GameInput";

export interface GameInputSpecialized {
  inputMethod: GameInputMethod;

  startListening(): void;

  /**
   * @returns Whether any events were added to eventsCollector
   */
  update(eventsCollector: Set<BpxGameInputEvent>): boolean;
}
