import { GameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

type GuiGameInputParams = {
  muteButtonsSelector: string;
  fullScreenButtonsSelector: string;
};

export class MouseGameInput implements SpecializedGameInput {
  readonly #params: GuiGameInputParams;

  readonly #eventsSinceLastUpdate: Set<GameInputEvent> =
    new Set<GameInputEvent>();

  constructor(params: GuiGameInputParams) {
    this.#params = params;
  }

  startListening(): void {
    document
      .querySelectorAll<HTMLElement>(this.#params.muteButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#eventsSinceLastUpdate.add("mute_unmute_toggle");
        });
      });
    document
      .querySelectorAll<HTMLElement>(this.#params.fullScreenButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#eventsSinceLastUpdate.add("full_screen");
        });
      });
  }

  update(eventsCollector: Set<GameInputEvent>): void {
    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
    }
    this.#eventsSinceLastUpdate.clear();
  }
}
