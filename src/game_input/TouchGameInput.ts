import { HtmlTemplate } from "../HtmlTemplate";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class TouchGameInput implements SpecializedGameInput {
  inputMethod: GameInputMethod = "touch";

  static mapping: Array<{
    event: BpxGameInputEvent;
    selector: string;
  }> = [
    { event: "button_left", selector: HtmlTemplate.selectors.controlsLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsDownLeft },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsRight },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsUpRight },
    {
      event: "button_right",
      selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUp },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpRight },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDown },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDownLeft },
    {
      event: "button_down",
      selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_a", selector: HtmlTemplate.selectors.controlsA },
    { event: "button_b", selector: HtmlTemplate.selectors.controlsB },
    { event: "button_menu", selector: HtmlTemplate.selectors.controlsMenu },
    {
      event: "mute_unmute_toggle",
      selector: HtmlTemplate.selectors.controlsMuteToggle,
    },
    {
      event: "full_screen",
      selector: HtmlTemplate.selectors.controlsFullScreen,
    },
  ];

  readonly #eventsAndButtons: Map<BpxGameInputEvent, HTMLElement[]> = new Map([
    ["button_left", []],
    ["button_right", []],
    ["button_up", []],
    ["button_down", []],
    ["button_a", []],
    ["button_b", []],
    ["button_menu", []],
    ["mute_unmute_toggle", []],
    ["full_screen", []],
  ]);

  readonly #eventsSinceLastUpdate: Set<BpxGameInputEvent> =
    new Set<BpxGameInputEvent>();

  constructor() {
    TouchGameInput.mapping.forEach(({ event, selector }) => {
      const buttons = document.querySelectorAll<HTMLElement>(selector);
      this.#eventsAndButtons.get(event)!.push(...buttons);
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
    // Try to prevent iOS Safari from doing helpful things that do not apply
    //   to a game like: text selection, div selection, area zoom on a double
    //   tap, etc.
    touchEvent.preventDefault();

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

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let anythingAdded = false;

    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
      anythingAdded = true;
    }

    // On macOS Chrome and Safari touch events are not registered during full
    //   screen transition. If user touches the button for a typical short duration,
    //   it ends up recognized as still pressed after the full screen transition
    //   ends. Therefore, in order to toggle full screen back, user has to press
    //   the button twice: once to "release" the key, and second time to initiate
    //   the next full screen transition.
    // As a workaround we do not keep "full_screen" event "pressed", so the framework
    //   will recognize it as a key being up immediately.
    this.#eventsSinceLastUpdate.delete("full_screen");

    return anythingAdded;
  }
}
