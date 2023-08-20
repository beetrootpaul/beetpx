import { GameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class TouchGameInput implements SpecializedGameInput {
  readonly #eventsAndButtons: Map<GameInputEvent, HTMLElement[]> = new Map([
    ["button_left", []],
    ["button_right", []],
    ["button_up", []],
    ["button_down", []],
    ["button_o", []],
    ["button_x", []],
    ["button_menu", []],
  ]);

  readonly #eventsSinceLastUpdate: Set<GameInputEvent> =
    new Set<GameInputEvent>();

  constructor() {
    // TODO: externalize these CSS selectors as framework params or some separate class which keeps all the CSS classes etc.
    this.#eventsAndButtons
      .get("button_left")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_left"));
    this.#eventsAndButtons
      .get("button_right")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_right"));
    this.#eventsAndButtons
      .get("button_up")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_up"));
    this.#eventsAndButtons
      .get("button_down")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_down"));
    this.#eventsAndButtons
      .get("button_o")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_o"));
    this.#eventsAndButtons
      .get("button_x")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_x"));
    this.#eventsAndButtons
      .get("button_menu")
      ?.push(...document.querySelectorAll<HTMLElement>(".controls_menu"));
  }

  startListening(): void {
    document
      // TODO: externalize this selector as a framework params or some separate class which keeps all the CSS classes etc.
      .querySelectorAll<HTMLElement>(".touch_controls")
      .forEach((touchArea) => {
        touchArea.addEventListener("touchstart", (touchEvent) => {
          this.#handleTouchEvent(touchEvent);
        });
        touchArea.addEventListener("touchmove", (touchEvent) => {
          this.#handleTouchEvent(touchEvent);
        });
        touchArea.addEventListener("touchcancel", (touchEvent) => {
          this.#handleTouchEvent(touchEvent);
        });
        touchArea.addEventListener("touchend", (touchEvent) => {
          this.#handleTouchEvent(touchEvent);
        });
      });
  }

  #handleTouchEvent(touchEvent: TouchEvent): void {
    for (const [gameInputEvent, buttons] of this.#eventsAndButtons.entries()) {
      let hasTouchWithinButtonBounds = false;
      Array.from(touchEvent.touches).forEach((touch) => {
        buttons.forEach((b) => {
          const boundingRect = b.getBoundingClientRect();
          if (
            touch.clientX > boundingRect.left &&
            touch.clientX < boundingRect.right &&
            touch.clientY > boundingRect.top &&
            touch.clientY < boundingRect.bottom
          ) {
            hasTouchWithinButtonBounds = true;
          }
        });
      });
      if (hasTouchWithinButtonBounds) {
        this.#eventsSinceLastUpdate.add(gameInputEvent);
      } else {
        this.#eventsSinceLastUpdate.delete(gameInputEvent);
      }
    }
  }

  update(eventsCollector: Set<GameInputEvent>): void {
    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
    }
  }
}
