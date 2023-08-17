import { Button } from "./Button";
import { Buttons } from "./Buttons";
import { GamepadGameInput } from "./GamepadGameInput";
import { KeyboardGameInput } from "./KeyboardGameInput";
import { MouseGameInput } from "./MouseGameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";
import { TouchGameInput } from "./TouchGameInput";

// TODO: separate events available to pass as param for the continuous ones and for the fire once ones
export type GameInputEvent =
  | null
  | "button_left"
  | "button_right"
  | "button_up"
  | "button_down"
  // TODO: consider moving towards Z/X instead of O/X
  | "button_x"
  | "button_o"
  | "button_menu"
  | "mute_unmute_toggle"
  | "full_screen"
  | "debug_toggle"
  | "frame_by_frame_toggle"
  | "frame_by_frame_step";

type GameInputParams = {
  muteButtonsSelector: string;
  fullScreenButtonsSelector: string;
  debugToggleKey?: string;
  debugFrameByFrameActivateKey?: string;
  debugFrameByFrameStepKey?: string;
};

export class GameInput {
  readonly #specializedGameInputs: SpecializedGameInput[];

  readonly gameButtons: Buttons;

  readonly buttonFullScreen: Button;
  readonly buttonMuteUnmute: Button;
  readonly buttonDebugToggle: Button;
  readonly buttonFrameByFrameToggle: Button;
  readonly buttonFrameByFrameStep: Button;

  constructor(params: GameInputParams) {
    this.#specializedGameInputs = [
      new MouseGameInput({
        muteButtonsSelector: params.muteButtonsSelector,
        fullScreenButtonsSelector: params.fullScreenButtonsSelector,
      }),
      new KeyboardGameInput({
        debugToggleKey: params.debugToggleKey,
        debugFrameByFrameActivateKey: params.debugFrameByFrameActivateKey,
        debugFrameByFrameStepKey: params.debugFrameByFrameStepKey,
      }),
      new TouchGameInput(),
      new GamepadGameInput(),
    ];

    this.gameButtons = new Buttons();

    this.buttonFullScreen = new Button();
    this.buttonMuteUnmute = new Button();
    this.buttonDebugToggle = new Button();
    this.buttonFrameByFrameToggle = new Button();
    this.buttonFrameByFrameStep = new Button();
  }

  startListening(): void {
    for (const sgi of this.#specializedGameInputs) {
      sgi.startListening();
    }
  }

  update(params: { skipGameButtons: boolean }): void {
    const events = new Set<GameInputEvent>();
    for (const sgi of this.#specializedGameInputs) {
      sgi.update(events);
    }

    if (!params.skipGameButtons) {
      this.gameButtons.update(events);
    }

    this.buttonFullScreen.update(events.has("full_screen"));
    this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
    this.buttonDebugToggle.update(events.has("debug_toggle"));
    this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
    this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));
  }

  wasAnyButtonPressed(): boolean {
    return (
      this.gameButtons.wasAnyJustPressed() ||
      this.buttonFullScreen.wasJustPressed(false) ||
      this.buttonMuteUnmute.wasJustPressed(false) ||
      this.buttonDebugToggle.wasJustPressed(false) ||
      this.buttonFrameByFrameToggle.wasJustPressed(false) ||
      this.buttonFrameByFrameStep.wasJustPressed(false)
    );
  }
}
