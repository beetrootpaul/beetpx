import { ButtonName } from "./Buttons";
import { GameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class TouchGameInput implements SpecializedGameInput {
  static mapping: Array<{
    event: GameInputEvent;
    button: ButtonName;
    selector: string;
  }> = [
    // TODO: externalize these CSS selectors as framework params or some separate class which keeps all the CSS classes etc.
    { event: "button_left", button: "left", selector: ".controls_left" },
    { event: "button_right", button: "right", selector: ".controls_right" },
    { event: "button_up", button: "up", selector: ".controls_up" },
    { event: "button_down", button: "down", selector: ".controls_down" },
    { event: "button_o", button: "o", selector: ".controls_o" },
    { event: "button_x", button: "x", selector: ".controls_x" },
    { event: "button_menu", button: "menu", selector: ".controls_menu" },
  ];

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

  constructor(params: { visibleButtons: ButtonName[] }) {
    TouchGameInput.mapping.forEach(({ event, button, selector }) => {
      const touchButtonElements =
        document.querySelectorAll<HTMLElement>(selector);
      this.#eventsAndButtons.get(event)!.push(...touchButtonElements);
      if (params.visibleButtons.includes(button)) {
        for (const el of touchButtonElements) {
          el.classList.remove("hidden");
        }
      }
    });
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
