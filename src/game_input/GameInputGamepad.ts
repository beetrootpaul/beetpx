import { BpxBrowserType } from "../browser/BrowserTypeDetector";
import { isDefined } from "../helpers/isDefined";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { GameInputSpecialized } from "./GameInputSpecialized";
import { GamepadMapping } from "./gamepad_mapping/GamepadMapping";
import { GamepadMapping8BitDo } from "./gamepad_mapping/GamepadMapping8BitDo";
import { GamepadMappingFallback } from "./gamepad_mapping/GamepadMappingFallback";
import { GamepadMappingFirefox8BitDoOther } from "./gamepad_mapping/GamepadMappingFirefox8BitDoOther";
import { GamepadMappingFirefox8BitDoWindows } from "./gamepad_mapping/GamepadMappingFirefox8BitDoWindows";
import { GamepadMappingFirefoxDualSenseOther } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseOther";
import { GamepadMappingFirefoxDualSenseWindows } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseWindows";
import { GamepadMappingFirefoxFallback } from "./gamepad_mapping/GamepadMappingFirefoxFallback";
import { GamepadMappingSafari8BitDo } from "./gamepad_mapping/GamepadMappingSafari8BitDo";
import { GamepadMappingStandard } from "./gamepad_mapping/GamepadMappingStandard";
import { BpxGamepadTypeDetector } from "./GamepadTypeDetector";

export const supportedGamepadTypes = [
  "xbox",
  "dualsense",
  "8bitdo",
  "other",
] as const;

export type BpxGamepadType = (typeof supportedGamepadTypes)[number];

export class GameInputGamepad implements GameInputSpecialized {
  inputMethod: GameInputMethod = "gamepad";

  readonly #browserType: BpxBrowserType;

  readonly #mappings = {
    standard: new GamepadMappingStandard(),
    firefoxDualSenseWindows: new GamepadMappingFirefoxDualSenseWindows(),
    firefoxDualSenseOther: new GamepadMappingFirefoxDualSenseOther(),
    firefox8bitdoWindows: new GamepadMappingFirefox8BitDoWindows(),
    firefox8bitdoOther: new GamepadMappingFirefox8BitDoOther(),
    firefoxOther: new GamepadMappingFirefoxFallback(),
    safari8bitdo: new GamepadMappingSafari8BitDo(),
    "8bitdo": new GamepadMapping8BitDo(),
    other: new GamepadMappingFallback(),
  };

  constructor(params: { browserType: BpxBrowserType }) {
    this.#browserType = params.browserType;
  }

  startListening(): void {
    // do nothing
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let wasAnyEventDetected = false;

    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad) continue;

      const mapping = this.#mappingFor(gamepad);

      for (
        let buttonIndex = 0;
        buttonIndex < gamepad.buttons.length;
        ++buttonIndex
      ) {
        const event = mapping.eventForButton(
          buttonIndex,
          gamepad.buttons[buttonIndex]!,
        );
        if (event) {
          eventsCollector.add(event);
          wasAnyEventDetected = true;
        }
      }

      for (let axisIndex = 0; axisIndex < gamepad.axes.length; ++axisIndex) {
        mapping
          .eventsForAxisValue(axisIndex, gamepad.axes[axisIndex]!)
          .forEach(event => {
            eventsCollector.add(event);
            wasAnyEventDetected = true;
          });
      }
    }

    return wasAnyEventDetected;
  }

  connectedGamepadTypes(): Set<BpxGamepadType> {
    return new Set<BpxGamepadType>(
      navigator
        .getGamepads()
        .filter(isDefined)
        .map(gamepad => BpxGamepadTypeDetector.detect(gamepad)),
    );
  }

  #mappingFor(gamepad: Gamepad): GamepadMapping {
    const gamepadType = BpxGamepadTypeDetector.detect(gamepad);

    if (
      this.#browserType === "firefox_windows" ||
      this.#browserType === "firefox_other"
    ) {
      if (gamepadType === "dualsense") {
        return this.#browserType === "firefox_windows" ?
            this.#mappings.firefoxDualSenseWindows
          : this.#mappings.firefoxDualSenseOther;
      } else if (gamepadType === "8bitdo") {
        return this.#browserType === "firefox_windows" ?
            this.#mappings.firefox8bitdoWindows
          : this.#mappings.firefox8bitdoOther;
      } else {
        return this.#mappings.firefoxOther;
      }
    }

    if (gamepadType === "8bitdo") {
      return this.#browserType === "safari" ?
          this.#mappings.safari8bitdo
        : this.#mappings["8bitdo"];
    }

    // We cannot check `mapping` before checking if it is Firefox, because
    //   Firefox claims the `mapping` of Xbox One controller is `"standard"`,
    //   while it is not…
    if (gamepad.mapping === "standard") {
      return this.#mappings.standard;
    } else {
      return this.#mappings.other;
    }
  }
}
