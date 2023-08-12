import { GamepadGameInput } from "./GamepadGameInput";
import { GuiGameInput } from "./GuiGameInput";
import { KeyboardGameInput } from "./KeyboardGameInput";
import { TouchGameInput } from "./TouchGameInput";

export type GameInputEvent =
  | null
  | "button_left"
  | "button_right"
  | "button_up"
  | "button_down"
  | "button_x"
  | "button_o"
  | "mute_unmute_toggle"
  | "full_screen"
  | "debug_toggle";

export const gameInputEventBehavior: Record<string, { fireOnce?: boolean }> = {
  // TODO: move full_screen out of this set OR move its handling to TouchGameInput and similar ones
  mute_unmute_toggle: { fireOnce: true },
  full_screen: { fireOnce: true },
  debug_toggle: { fireOnce: true },
};

type GameInputParams = {
  muteButtonsSelector: string;
  fullScreenButtonsSelector: string;
  debugToggleKey?: string;
};

export class GameInput {
  readonly #guiGameInput: GuiGameInput;
  readonly #keyboardGameInput: KeyboardGameInput;
  readonly #touchGameInput: TouchGameInput;
  readonly #gamepadGameInput: GamepadGameInput;

  constructor(params: GameInputParams) {
    this.#guiGameInput = new GuiGameInput({
      muteButtonsSelector: params.muteButtonsSelector,
      fullScreenButtonsSelector: params.fullScreenButtonsSelector,
    });
    this.#keyboardGameInput = new KeyboardGameInput({
      debugToggleKey: params.debugToggleKey,
    });
    this.#touchGameInput = new TouchGameInput();
    this.#gamepadGameInput = new GamepadGameInput();
  }

  startListening(): void {
    this.#guiGameInput.startListening();
    this.#keyboardGameInput.startListening();
    this.#touchGameInput.startListening();
  }

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#guiGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#keyboardGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#touchGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#gamepadGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }

  consumeFireOnceEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#guiGameInput.consumeFireOnceEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#keyboardGameInput.consumeFireOnceEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }
}
