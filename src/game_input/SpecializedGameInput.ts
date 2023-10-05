import { BpxGameInputEvent } from "./GameInput";

export interface SpecializedGameInput {
  startListening(): void;
  update(eventsCollector: Set<BpxGameInputEvent>): void;
}
