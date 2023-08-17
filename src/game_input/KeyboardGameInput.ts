import { GameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

type KeyboardGameInputParams = {
  debugToggleKey?: string;
  debugFrameByFrameActivateKey?: string;
  debugFrameByFrameStepKey?: string;
};

export class KeyboardGameInput implements SpecializedGameInput {
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

    ["Escape", "button_menu"],
    ["Enter", "button_menu"],
    ["p", "button_menu"],
    ["P", "button_menu"],

    ["m", "mute_unmute_toggle"],
    ["M", "mute_unmute_toggle"],

    ["f", "full_screen"],
    ["F", "full_screen"],
  ]);

  readonly #eventsSinceLastUpdate: Set<GameInputEvent> =
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
        this.#eventsSinceLastUpdate.add(gameInputEvent);
      }
    });
    document.addEventListener("keyup", (keyboardEvent: KeyboardEvent) => {
      const gameInputEvent = this.#keyMapping.get(keyboardEvent.key);
      if (gameInputEvent) {
        keyboardEvent.preventDefault();
        this.#eventsSinceLastUpdate.delete(gameInputEvent);
      }
    });
  }

  update(eventsCollector: Set<GameInputEvent>): void {
    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
    }
  }
}
