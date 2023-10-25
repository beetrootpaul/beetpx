import { BpxBrowserType } from "../browser/BrowserTypeDetector";
import { u_ } from "../Utils";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import {
  GamepadMapping,
  gamepadMappingFor,
} from "./gamepad_mapping/GamepadMapping";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
import { SpecializedGameInput } from "./SpecializedGameInput";

export const supportedGamepadTypes = ["xbox", "dualsense", "other"] as const;

export type BpxGamepadType = (typeof supportedGamepadTypes)[number];

export class GamepadGameInput implements SpecializedGameInput {
  inputMethod: GameInputMethod = "gamepad";

  readonly #mappings: Map<BpxGamepadType, GamepadMapping> = new Map();

  constructor(params: { browserType: BpxBrowserType }) {
    supportedGamepadTypes.forEach((gamepadType) => {
      this.#mappings.set(
        gamepadType,
        gamepadMappingFor(gamepadType, params.browserType),
      );
    });
  }

  startListening(): void {
    // do nothing
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let wasAnyEventDetected = false;

    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad) continue;

      const mapping = this.#mappings.get(GamepadTypeDetector.detect(gamepad));
      if (!mapping) continue;

      gamepad.buttons.forEach((button, buttonIndex) => {
        const event = mapping.eventForButton(buttonIndex, button);
        if (event) {
          eventsCollector.add(event);
          wasAnyEventDetected = true;
        }
      });

      gamepad.axes.forEach((axisValue, axisIndex) => {
        mapping.eventsForAxisValue(axisIndex, axisValue).forEach((event) => {
          eventsCollector.add(event);
          wasAnyEventDetected = true;
        });
      });
    }

    return wasAnyEventDetected;
  }

  connectedGamepadTypes(): Set<BpxGamepadType> {
    return new Set<BpxGamepadType>(
      navigator
        .getGamepads()
        .filter(u_.isDefined)
        .map((gamepad) => GamepadTypeDetector.detect(gamepad)),
    );
  }
}
