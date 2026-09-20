import { BpxGameInputEvent, BpxGameInputMethod } from "./GameInput";

export interface GameInputSpecialized {
  inputMethod: BpxGameInputMethod;

  startListening(): void;

  /**
   * @returns Whether any events were added to eventsCollector
   */
  update(eventsCollector: Set<BpxGameInputEvent>): boolean;
}
