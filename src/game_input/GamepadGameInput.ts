import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

/*
controller:
  macOS, Firefox, Xbox (id: "45e-2fd-Xbox Wireless Controller")
buttons:
  - A -> 1
  - B -> 2
  - X -> 3
  - Y -> 5
  - LB -> 5
  - RB -> 8
  - LT -> -
  - RT -> -
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - Xbox logo                    ->  0
  - "two windows" (center left ) ->  8
  - menu          (center right) -> 16
  - left  stick pressed -> 11
  - right stick pressed -> 16
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )

controller:
  macOS, Firefox, PS5 DualSense (id: "54c-ce6-DualSense Wireless Controller")
buttons:
  - x        -> 1
  - circle   -> 2
  - square   -> 0
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6
  - R2 -> 7
  - dpad up    -> -
  - dpad down  -> -
  - dpad left  -> -
  - dpad right -> -
  - touch panel press -> 13
  - PS logo                      -> 12
  - microphone                   ->  -
  - "three lines" (center left ) ->  8
  - menu          (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
  - dpad -> 4 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 idle        1.29
              )
 */

// Constants for DualSense calculations. Not inside the class for sake of access brevity.
const ds = {
  dpadAxisIndex: 4,
  dpadStep: 2 / 7,
  dpadRangeThreshold: 0.25 * (2 / 7),
};

export class GamepadGameInput implements SpecializedGameInput {
  inputMethod: GameInputMethod = "gamepad";

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

  readonly axisThreshold: number = 0.6;

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

  // [min, max, event]
  readonly #dualSenseDpadValueRanges: [number, number, BpxGameInputEvent][] = [
    [-1, -1 + 2 / 7, "button_up"],
    [-1 + 2 / 7, -1 + 3 * (2 / 7), "button_right"],
    [-1 + 3 * (2 / 7), -1 + 5 * (2 / 7), "button_down"],
    [-1 + 5 * (2 / 7), -1 + 7 * (2 / 7), "button_left"],
    [-1 + 7 * (2 / 7), -1 + 7 * (2 / 7), "button_up"],
  ];

  startListening(): void {
    // nothing to be done here
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let anythingAdded = false;

    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed || button.touched) {
            const gameInputEvent = this.buttonMapping.get(buttonIndex);
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
              anythingAdded = true;
            }
          }
        });
        gamepad.axes.forEach((axis, axisIndex) => {
          if (axisIndex === ds.dpadAxisIndex) {
            this.#dualSenseDpadValueRanges.forEach(
              ([min, max, gameInputEvent]) => {
                if (
                  axis > min - ds.dpadRangeThreshold &&
                  axis < max + ds.dpadRangeThreshold
                ) {
                  eventsCollector.add(gameInputEvent);
                  anythingAdded = true;
                }
              },
            );
          } else {
            if (Math.abs(axis) > this.axisThreshold) {
              const gameInputEvent = this.#axisMapping.get(
                100 * axisIndex + Math.sign(axis),
              );
              if (gameInputEvent) {
                eventsCollector.add(gameInputEvent);
                anythingAdded = true;
              }
            }
          }
        });
      }
    });

    return anythingAdded;
  }
}
