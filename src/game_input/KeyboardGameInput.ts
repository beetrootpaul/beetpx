import { GameInputEvent, gameInputEventBehavior } from "./GameInput";

type KeyboardGameInputParams = {
  debugToggleKey?: string;
};

export class KeyboardGameInput {
  readonly #keyMapping: Map<string, GameInputEvent> = new Map<
    string,
    GameInputEvent
  >([
    ["ArrowLeft", "left"],
    ["ArrowRight", "right"],
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
    ["a", "left"],
    ["d", "right"],
    ["w", "up"],
    ["s", "down"],
    ["A", "left"],
    ["D", "right"],
    ["W", "up"],
    ["S", "down"],
    ["m", "mute_unmute_toggle"],
    ["M", "mute_unmute_toggle"],
    ["f", "full_screen"],
    ["F", "full_screen"],
  ]);

  readonly #currentContinuousEvents: Set<GameInputEvent> =
    new Set<GameInputEvent>();
  readonly #recentFireOnceEvents: Set<GameInputEvent> =
    new Set<GameInputEvent>();

  constructor(params: KeyboardGameInputParams) {
    if (params.debugToggleKey) {
      this.#keyMapping.set(params.debugToggleKey, "debug_toggle");
    }
  }

  startListening(): void {
    document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
      const gameInputEvent = this.#keyMapping.get(keyboardEvent.key);
      if (gameInputEvent) {
        keyboardEvent.preventDefault();
        if (!gameInputEventBehavior[gameInputEvent]?.fireOnce) {
          this.#currentContinuousEvents.add(gameInputEvent);
        }
      }
    });
    document.addEventListener("keyup", (keyboardEvent) => {
      const gameInputEvent = this.#keyMapping.get(keyboardEvent.key);
      if (gameInputEvent) {
        keyboardEvent.preventDefault();
        if (gameInputEventBehavior[gameInputEvent]?.fireOnce) {
          this.#recentFireOnceEvents.add(gameInputEvent);
        } else {
          this.#currentContinuousEvents.delete(gameInputEvent);
        }
      }
    });
  }

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    return this.#currentContinuousEvents;
  }

  consumeFireOnceEvents(): Set<GameInputEvent> {
    const events = new Set(this.#recentFireOnceEvents);
    this.#recentFireOnceEvents.clear();
    return events;
  }
}
