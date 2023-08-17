import { GameInputEvent } from "./GameInput";

export interface SpecializedGameInput {
  startListening(): void;
  update(eventsCollector: Set<GameInputEvent>): void;
}
