import { BpxBrowserType } from "../../browser/BrowserTypeDetector";
import { BpxGameInputEvent } from "../GameInput";
import { BpxGamepadType } from "../GamepadGameInput";
import { GamepadMappingDefault } from "./GamepadMappingDefault";
import { GamepadMappingFirefoxDualSense } from "./GamepadMappingFirefoxDualSense";
import { GamepadMappingFirefoxXbox } from "./GamepadMappingFirefoxXbox";

export function gamepadMappingFor(
  gamepadType: BpxGamepadType,
  browserType: BpxBrowserType,
): GamepadMapping {
  if (browserType === "firefox") {
    if (gamepadType === "xbox") {
      return new GamepadMappingFirefoxXbox();
    } else {
      // let's use DualSense as a default one for all other gamepad types
      return new GamepadMappingFirefoxDualSense();
    }
  } else {
    return new GamepadMappingDefault();
  }
}

export interface GamepadMapping {
  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null;

  eventForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent | null;
}
