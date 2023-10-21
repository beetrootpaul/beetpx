import { BpxGameInputEvent, GameInputMethod } from "./GameInput";

export interface SpecializedGameInput {
  inputMethod: GameInputMethod;

  startListening(): void;

  /**
   * @return Whether any events were added to eventsCollector
   */
  update(eventsCollector: Set<BpxGameInputEvent>): boolean;
}
