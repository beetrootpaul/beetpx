import { BpxGameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

/*
controller:
  macOS, Firefox, Xbox (id: ???)
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
  macOS, Firefox, PS 5 (id: "54c-ce6-DualSense Wireless Controller")
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
  -        dpad, horizontal -> 4 ( left 0.71 : -0.43 right : 1.29 idle after left/right)
  -        dpad, vertical   -> 4 (  up -1.00 :  0.14 down  : 1.29 idle after   up/down )
 */
export class GamepadGameInput implements SpecializedGameInput {
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

  startListening(): void {
    // nothing to be done here
  }

  update(eventsCollector: Set<BpxGameInputEvent>): void {
    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed || button.touched) {
            const gameInputEvent = this.buttonMapping.get(buttonIndex);
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
            }
          }
        });
        gamepad.axes.forEach((axis, axisIndex, x) => {
          if (Math.abs(axis) > this.axisThreshold) {
            const gameInputEvent = this.#axisMapping.get(
              100 * axisIndex + Math.sign(axis),
            );
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
            }
          }
        });
      }
    });
  }
}
