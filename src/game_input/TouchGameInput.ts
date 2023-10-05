import { HtmlTemplate } from "../HtmlTemplate";
import { BpxButtonName } from "./Buttons";
import { BpxGameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class TouchGameInput implements SpecializedGameInput {
  static mapping: Array<{
    event: BpxGameInputEvent;
    button: BpxButtonName;
    selector: string;
  }> = [
    {
      event: "button_left",
      button: "left",
      selector: HtmlTemplate.selectors.controlsLeft,
    },
    {
      event: "button_right",
      button: "right",
      selector: HtmlTemplate.selectors.controlsRight,
    },
    {
      event: "button_up",
      button: "up",
      selector: HtmlTemplate.selectors.controlsUp,
    },
    {
      event: "button_down",
      button: "down",
      selector: HtmlTemplate.selectors.controlsDown,
    },
    {
      event: "button_o",
      button: "o",
      selector: HtmlTemplate.selectors.controlsO,
    },
    {
      event: "button_x",
      button: "x",
      selector: HtmlTemplate.selectors.controlsX,
    },
    {
      event: "button_menu",
      button: "menu",
      selector: HtmlTemplate.selectors.controlsMenu,
    },
  ];

  readonly #eventsAndButtons: Map<BpxGameInputEvent, HTMLElement[]> = new Map([
    ["button_left", []],
    ["button_right", []],
    ["button_up", []],
    ["button_down", []],
    ["button_o", []],
    ["button_x", []],
    ["button_menu", []],
  ]);

  readonly #eventsSinceLastUpdate: Set<BpxGameInputEvent> =
    new Set<BpxGameInputEvent>();

  constructor(params: { visibleButtons: BpxButtonName[] }) {
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
      .querySelectorAll<HTMLElement>(HtmlTemplate.selectors.touchControls)
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

  update(eventsCollector: Set<BpxGameInputEvent>): void {
    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
    }
  }
}
