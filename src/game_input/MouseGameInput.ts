import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class MouseGameInput implements SpecializedGameInput {
  inputMethod: GameInputMethod = "mouse";

  readonly #muteButtonsSelector: string;
  readonly #fullScreenButtonsSelector: string;

  readonly #eventsSinceLastUpdate: Set<BpxGameInputEvent> =
    new Set<BpxGameInputEvent>();

  constructor(params: {
    muteButtonsSelector: string;
    fullScreenButtonsSelector: string;
  }) {
    this.#muteButtonsSelector = params.muteButtonsSelector;
    this.#fullScreenButtonsSelector = params.fullScreenButtonsSelector;
  }

  startListening(): void {
    document
      .querySelectorAll<HTMLElement>(this.#muteButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#eventsSinceLastUpdate.add("mute_unmute_toggle");
        });
      });
    document
      .querySelectorAll<HTMLElement>(this.#fullScreenButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#eventsSinceLastUpdate.add("full_screen");
        });
      });
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let anythingAdded = false;

    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
      anythingAdded = true;
    }
    this.#eventsSinceLastUpdate.clear();

    return anythingAdded;
  }
}
