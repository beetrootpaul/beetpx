import { GameInputEvent, gameInputEventBehavior } from "./GameInput";

type KeyboardGameInputParams = {
  debugToggleKey?: string;
  debugFrameByFrameActivateKey?: string;
  debugFrameByFrameStepKey?: string;
};

export class KeyboardGameInput {
  readonly #keyMapping: Map<string, GameInputEvent> = new Map<
    string,
    GameInputEvent
  >([
    ["ArrowLeft", "button_left"],
    ["ArrowRight", "button_right"],
    ["ArrowUp", "button_up"],
    ["ArrowDown", "button_down"],
    ["a", "button_left"],
    ["A", "button_left"],
    ["d", "button_right"],
    ["D", "button_right"],
    ["w", "button_up"],
    ["W", "button_up"],
    ["s", "button_down"],
    ["S", "button_down"],
    ["x", "button_x"],
    ["X", "button_x"],
    // TODO: what about different keyboard layouts where "z" is not on the left from "x"?
    ["z", "button_o"],
    ["z", "button_o"],
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
    if (params.debugFrameByFrameActivateKey) {
      this.#keyMapping.set(
        params.debugFrameByFrameActivateKey,
        "frame_by_frame_toggle",
      );
    }
    if (params.debugFrameByFrameStepKey) {
      this.#keyMapping.set(
        params.debugFrameByFrameStepKey,
        "frame_by_frame_step",
      );
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
