import { BpxBrowserType } from "../browser/BrowserTypeDetector";
import { u_ } from "../Utils";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import {
  GamepadMapping,
  gamepadMappingFor,
} from "./gamepad_mapping/GamepadMapping";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
import { SpecializedGameInput } from "./SpecializedGameInput";

// TODO: EXTRACT
// Constants for DualSense calculations. Not inside the class for sake of access brevity.
const ds = {
  dpadAxisIndex: 4,
  dpadStep: 2 / 7,
  dpadRangeThreshold: 0.25 * (2 / 7),
};

export const supportedGamepadTypes = ["xbox", "dualsense", "other"] as const;

export type BpxGamepadType = (typeof supportedGamepadTypes)[number];

export class GamepadGameInput implements SpecializedGameInput {
  inputMethod: GameInputMethod = "gamepad";

  // TODO: EXTRACT
  readonly buttonMapping: Map<number, BpxGameInputEvent> = new Map<
    number,
    BpxGameInputEvent
  >([
    [0, "button_a"],
    [1, "button_a"],
    [2, "button_b"],
    [3, "button_b"],
    [5, "button_a"],
    [8, "button_menu"],
    [9, "button_menu"],
    [12, "button_up"],
    [13, "button_down"],
    [14, "button_left"],
    [15, "button_right"],
    [16, "button_menu"],
  ]);

  // TODO: EXTRACT
  readonly #axisThreshold: number = 0.6;

  // TODO: EXTRACT
  readonly #axisMapping: Map<number, BpxGameInputEvent> = new Map<
    number,
    BpxGameInputEvent
  >([
    // keys here are: 100 * axis index + sign(axis value)
    [0 - 1, "button_left"],
    [0 + 1, "button_right"],
    [100 - 1, "button_up"],
    [100 + 1, "button_down"],
    [200 - 1, "button_left"],
    [200 + 1, "button_right"],
    [300 - 1, "button_up"],
    [300 + 1, "button_down"],
  ]);

  // TODO: EXTRACT
  // [min, max, event]
  readonly #dualSenseDpadValueRanges: [number, number, BpxGameInputEvent][] = [
    [-1, -1 + 2 / 7, "button_up"],
    [-1 + 2 / 7, -1 + 3 * (2 / 7), "button_right"],
    [-1 + 3 * (2 / 7), -1 + 5 * (2 / 7), "button_down"],
    [-1 + 5 * (2 / 7), -1 + 7 * (2 / 7), "button_left"],
    [-1 + 7 * (2 / 7), -1 + 7 * (2 / 7), "button_up"],
  ];

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
        const event = mapping.eventForAxisValue(axisIndex, axisValue);
        if (event) {
          eventsCollector.add(event);
          wasAnyEventDetected = true;
        }
        // TODO
        // if (axisIndex === ds.dpadAxisIndex) {
        //           this.#dualSenseDpadValueRanges.forEach(
        //             ([min, max, gameInputEvent]) => {
        //               if (
        //                 axis > min - ds.dpadRangeThreshold &&
        //                 axis < max + ds.dpadRangeThreshold
        //               ) {
        //                 eventsCollector.add(gameInputEvent);
        //                 wasAnyEventDetected = true;
        //               }
        //             },
        //           );
        //         } else {
        //           if (Math.abs(axis) > this.#axisThreshold) {
        //             const gameInputEvent = this.#axisMapping.get(
        //               100 * axisIndex + Math.sign(axis),
        //             );
        //             if (gameInputEvent) {
        //               eventsCollector.add(gameInputEvent);
        //               wasAnyEventDetected = true;
        //             }
        //           }
        //         }
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
