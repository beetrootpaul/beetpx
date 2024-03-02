import { HtmlTemplate } from "../HtmlTemplate";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { GameInputSpecialized } from "./GameInputSpecialized";

export class GameInputMouse implements GameInputSpecialized {
  inputMethod: GameInputMethod = "mouse";

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

  readonly #eventsSinceLastUpdate: Set<BpxGameInputEvent> =
    new Set<BpxGameInputEvent>();

  startListening(): void {
    GameInputMouse.mapping.forEach(({ event, selector }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((button) => {
        button.addEventListener("mousedown", () => {
          this.#eventsSinceLastUpdate.add(event);
        });
        button.addEventListener("mouseup", () => {
          this.#eventsSinceLastUpdate.delete(event);
        });
      });
    });
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let anythingAdded = false;

    for (const event of this.#eventsSinceLastUpdate) {
      eventsCollector.add(event);
      anythingAdded = true;
    }

    // On macOS Chrome and Safari mouse events are not registered during full
    //   screen transition. If user presses the button for a typical short duration,
    //   it ends up recognized as still pressed after the full screen transition
    //   ends. Therefore, in order to toggle full screen back, user has to press
    //   the button twice: once to "release" the key, and second time to initiate
    //   the next full screen transition.
    // As a workaround we do not keep "full_screen" event "pressed", so the engine
    //   will recognize it as a key being up immediately.
    this.#eventsSinceLastUpdate.delete("full_screen");

    return anythingAdded;
  }
}
