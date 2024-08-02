import { BpxBrowserType } from "../browser/BrowserTypeDetector";
import { HtmlTemplate } from "../HtmlTemplate";
import { Button } from "./buttons/Button";
import { GameButtons } from "./buttons/GameButtons";
import { BpxGamepadType, GameInputGamepad } from "./GameInputGamepad";
import { GameInputKeyboard } from "./GameInputKeyboard";
import { GameInputMouse } from "./GameInputMouse";
import { GameInputSpecialized } from "./GameInputSpecialized";
import { GameInputTouch } from "./GameInputTouch";

/**
 * @see {@link BeetPx.getRecentInputMethods}
 *
 * @category Game input
 */
export type BpxGameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";

/**
 * Identifiers of the game input events.
 *
 * Typically you wouldn't need to use those type values unless dealing
 * with custom even handling.
 *
 * @see {@link BeetPx.getEventsCapturedInLastUpdate}
 *
 * @category Game input
 */
export type BpxGameInputEvent =
  | null
  | "button_left"
  | "button_right"
  | "button_up"
  | "button_down"
  | "button_O"
  | "button_X"
  | "button_menu"
  | "mute_unmute_toggle"
  | "full_screen"
  | "take_screenshot"
  | "browse_screenshots_toggle"
  | "debug_toggle"
  | "frame_by_frame_toggle"
  | "frame_by_frame_step";

export class GameInput {
  readonly gameInputsSpecialized: GameInputSpecialized[];
  readonly gameInputGamepad: GameInputGamepad;

  readonly gameButtons: GameButtons;

  readonly buttonFullScreen: Button;
  readonly buttonMuteUnmute: Button;
  readonly buttonTakeScreenshot: Button;
  readonly buttonBrowseScreenshots: Button;
  readonly buttonDebugToggle: Button;
  readonly buttonFrameByFrameToggle: Button;
  readonly buttonFrameByFrameStep: Button;

  #eventsCapturedInLastUpdate: Set<BpxGameInputEvent> = new Set();

  #mostRecentInputMethods: Set<BpxGameInputMethod> = new Set();

  constructor(params: {
    enableScreenshots: boolean;
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
        enableScreenshots: params.enableScreenshots,
        enableDebugToggle: params.enableDebugToggle,
        enableFrameByFrameControls: params.enableFrameByFrameControls,
      }),
      new GameInputTouch(),
      this.gameInputGamepad,
    ];

    this.gameButtons = new GameButtons();

    this.buttonFullScreen = new Button();
    this.buttonMuteUnmute = new Button();
    this.buttonTakeScreenshot = new Button();
    this.buttonBrowseScreenshots = new Button();
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
   * @returns If any interaction happened.
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
    this.buttonTakeScreenshot.update(events.has("take_screenshot"));
    this.buttonBrowseScreenshots.update(
      events.has("browse_screenshots_toggle"),
    );
    this.buttonDebugToggle.update(events.has("debug_toggle"));
    this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
    this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));

    HtmlTemplate.updatePressedClasses({
      up: this.gameButtons.isPressed("up"),
      down: this.gameButtons.isPressed("down"),
      left: this.gameButtons.isPressed("left"),
      right: this.gameButtons.isPressed("right"),
      O: this.gameButtons.isPressed("O"),
      X: this.gameButtons.isPressed("X"),
      menu: this.gameButtons.isPressed("menu"),
      mute: this.buttonMuteUnmute.isPressed,
      fullscreen: this.buttonFullScreen.isPressed,
    });

    return events.size > 0;
  }

  getRecentInputMethods(): Set<BpxGameInputMethod> {
    return this.#mostRecentInputMethods;
  }

  getConnectedGamepadTypes(): Set<BpxGamepadType> {
    return this.gameInputGamepad.connectedGamepadTypes();
  }

  getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent> {
    return this.#eventsCapturedInLastUpdate;
  }
}
