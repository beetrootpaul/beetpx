import { GameInputEvent } from "./GameInput";

// TODO: implement support for gameInputEventBehavior[gameInputEvent]?.fireOnce

export class TouchGameInput {
  readonly #buttonsAndEvents: [HTMLElement, GameInputEvent][] = [];

  readonly #currentContinuousEvents: Set<GameInputEvent> =
    new Set<GameInputEvent>();

  constructor() {
    // TODO: externalize these selectors as game params
    const selectorMapping: Map<string, GameInputEvent> = new Map<
      string,
      GameInputEvent
    >([
      [".controls_left", "left"],
      [".controls_right", "right"],
      [".controls_up", "up"],
      [".controls_down", "down"],
    ]);

    for (const [selector, gameInputEvent] of selectorMapping.entries()) {
      document.querySelectorAll<HTMLElement>(selector).forEach((button) => {
        this.#buttonsAndEvents.push([button, gameInputEvent]);
      });
    }
  }

  startListening(): void {
    document
      // TODO: externalize this selector
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

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    return this.#currentContinuousEvents;
  }

  #handleTouchEvent(touchEvent: TouchEvent): void {
    this.#currentContinuousEvents.clear();
    Array.from(touchEvent.touches).forEach((touch) => {
      this.#buttonsAndEvents.forEach(([button, gameInputEvent]) => {
        if (gameInputEvent) {
          const boundingRect = button.getBoundingClientRect();
          if (
            touch.clientX > boundingRect.left &&
            touch.clientX < boundingRect.right &&
            touch.clientY > boundingRect.top &&
            touch.clientY < boundingRect.bottom
          ) {
            touchEvent.preventDefault();
            this.#currentContinuousEvents.add(gameInputEvent);
          }
        }
      });
    });
  }
}
