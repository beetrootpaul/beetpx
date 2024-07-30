import { BpxBrowserType } from "../browser/BrowserTypeDetector";
import { HtmlTemplate } from "../HtmlTemplate";
import { Button } from "./buttons/Button";
import { GameButtons } from "./buttons/GameButtons";
import { BpxGamepadType, GameInputGamepad } from "./GameInputGamepad";
import { GameInputKeyboard } from "./GameInputKeyboard";
import { GameInputMouse } from "./GameInputMouse";
import { GameInputSpecialized } from "./GameInputSpecialized";
import { GameInputTouch } from "./GameInputTouch";

export type GameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";

/**
 * @category Game input
 */
export type BpxGameInputEvent =
  | null
  | "button_left"
  | "button_right"
  | "button_up"
  | "button_down"
  | "button_a"
  | "button_b"
  | "button_menu"
  | "mute_unmute_toggle"
  | "full_screen"
  | "debug_toggle"
  | "frame_by_frame_toggle"
  | "frame_by_frame_step";

export class GameInput {
  readonly gameInputsSpecialized: GameInputSpecialized[];
  readonly gameInputGamepad: GameInputGamepad;

  readonly gameButtons: GameButtons;

  readonly buttonFullScreen: Button;
  readonly buttonMuteUnmute: Button;
  readonly buttonDebugToggle: Button;
  readonly buttonFrameByFrameToggle: Button;
  readonly buttonFrameByFrameStep: Button;

  #eventsCapturedInLastUpdate: Set<BpxGameInputEvent> = new Set();

  #mostRecentInputMethods: Set<GameInputMethod> = new Set();

  constructor(params: {
    enableDebugToggle: boolean;
    enableFrameByFrameControls: boolean;
    browserType: BpxBrowserType;
  }) {
    this.gameInputGamepad = new GameInputGamepad({
      browserType: params.browserType,
    });
    this.gameInputsSpecialized = [
      new GameInputMouse(),
      new GameInputKeyboard({
        enableDebugToggle: params.enableDebugToggle,
        enableFrameByFrameControls: params.enableFrameByFrameControls,
      }),
      new GameInputTouch(),
      this.gameInputGamepad,
    ];

    this.gameButtons = new GameButtons();

    this.buttonFullScreen = new Button();
    this.buttonMuteUnmute = new Button();
    this.buttonDebugToggle = new Button();
    this.buttonFrameByFrameToggle = new Button();
    this.buttonFrameByFrameStep = new Button();
  }

  startListening(): void {
    for (const sgi of this.gameInputsSpecialized) {
      sgi.startListening();
    }
  }

  /**
   * @return If any interaction happened.
   */
  update(params: { skipGameButtons: boolean }): boolean {
    this.#mostRecentInputMethods.clear();

    const events = new Set<BpxGameInputEvent>();
    for (const sgi of this.gameInputsSpecialized) {
      if (sgi.update(events)) {
        // We do not care here if there were many input methods active at once,
        //   since usually it will be just one method.
        this.#mostRecentInputMethods.add(sgi.inputMethod);
      }
    }

    this.#eventsCapturedInLastUpdate = events;

    if (!params.skipGameButtons) {
      this.gameButtons.update(events);
    }

    this.buttonFullScreen.update(events.has("full_screen"));
    this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
    this.buttonDebugToggle.update(events.has("debug_toggle"));
    this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
    this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));

    HtmlTemplate.updatePressedClasses({
      up: this.gameButtons.isPressed("up"),
      down: this.gameButtons.isPressed("down"),
      left: this.gameButtons.isPressed("left"),
      right: this.gameButtons.isPressed("right"),
      a: this.gameButtons.isPressed("a"),
      b: this.gameButtons.isPressed("b"),
      menu: this.gameButtons.isPressed("menu"),
      mute: this.buttonMuteUnmute.isPressed,
      fullscreen: this.buttonFullScreen.isPressed,
    });

    return events.size > 0;
  }

  getRecentInputMethods(): Set<GameInputMethod> {
    return this.#mostRecentInputMethods;
  }

  getConnectedGamepadTypes(): Set<BpxGamepadType> {
    return this.gameInputGamepad.connectedGamepadTypes();
  }

  getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent> {
    return this.#eventsCapturedInLastUpdate;
  }
}
