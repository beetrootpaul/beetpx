import { GameInputEvent } from "./GameInput";

type GuiGameInputParams = {
  muteButtonsSelector: string;
  fullScreenButtonsSelector: string;
};

export class GuiGameInput {
  readonly #params: GuiGameInputParams;

  readonly #currentContinuousEvents: Set<GameInputEvent> =
    new Set<GameInputEvent>();
  readonly #recentFireOnceEvents: Set<GameInputEvent> =
    new Set<GameInputEvent>();

  constructor(params: GuiGameInputParams) {
    this.#params = params;
  }

  startListening(): void {
    document
      .querySelectorAll<HTMLElement>(this.#params.muteButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#recentFireOnceEvents.add("mute_unmute_toggle");
        });
      });
    document
      .querySelectorAll<HTMLElement>(this.#params.fullScreenButtonsSelector)
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.#recentFireOnceEvents.add("full_screen");
        });
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
