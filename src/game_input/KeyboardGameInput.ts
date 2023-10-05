import { BpxGameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class KeyboardGameInput implements SpecializedGameInput {
  readonly #keyMapping: Map<string, BpxGameInputEvent> = new Map<
    string,
    BpxGameInputEvent
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
    ["Z", "button_o"],

    ["Escape", "button_menu"],
    ["Enter", "button_menu"],
    ["p", "button_menu"],
    ["P", "button_menu"],

    ["m", "mute_unmute_toggle"],
    ["M", "mute_unmute_toggle"],

    ["f", "full_screen"],
    ["F", "full_screen"],
  ]);

  readonly #eventsSinceLastUpdate: Set<BpxGameInputEvent> =
    new Set<BpxGameInputEvent>();

  constructor(params: { enableDebugInputs: boolean }) {
    if (params.enableDebugInputs) {
      this.#keyMapping.set(";", "debug_toggle");
      this.#keyMapping.set(",", "frame_by_frame_toggle");
      this.#keyMapping.set(".", "frame_by_frame_step");
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

  update(eventsCollector: Set<BpxGameInputEvent>): void {
    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
    }
  }
}
