import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
import { SpecializedGameInput } from "./SpecializedGameInput";

// TODO: move those docs to specialized files per gamepad x browser x OS ?
/* Xbox

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
gamepad:
  "45e-2fd-Xbox Wireless Controller"
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


env:
  macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
gamepad:
  "Xbox Wireless Controller Extended Gamepad"
buttons:
  - A -> 0
  - B -> 1
  - X -> 2
  - Y -> 3
  - LB -> 4
  - RB -> 5
  - LT -> 6
  - RT -> 7
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - Xbox logo                    -> 16
  - "two windows" (center left ) ->  8
  - menu          (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )


env:
  macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
  macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
gamepad:
  "Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02fd)"
buttons:
  - A -> 0
  - B -> 1
  - X -> 2
  - Y -> 3
  - LB -> 4
  - RB -> 5
  - LT -> 6 ("touched: true" if half-pressed)
  - RT -> 7 ("touched: true" if half-pressed)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - Xbox logo                    -> 16
  - "two windows" (center left ) ->  8
  - menu          (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )

env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
gamepad:
  "xinput"
buttons:
  unresponsive
 axes and their ranges:
  unresponsive


env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (arm64)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
gamepad:
  "HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 02fd)"
  "Xbox 360 Controller (XInput STANDARD GAMEPAD)" <-- Vivaldi, and maye others as well in unclear circumstances
buttons:
  - A -> 0
  - B -> 1
  - X -> 2
  - Y -> 3
  - LB -> 4
  - RB -> 5
  - LT -> 6 ("touched: true" if half-pressed)
  - RT -> 7 ("touched: true" if half-pressed)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - Xbox logo                    -> - (also: it brings front some OS-wide overlay!)
  - "two windows" (center left ) -> 8
  - menu          (center right) -> 9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
*/

/* DualSense

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
gamepad:
  "54c-ce6-DualSense Wireless Controller"
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
  - L2                      -> 5 (idle -1.00 : 1.00 pushed)
  - R2                      -> 6 (idle -1.00 : 1.00 pushed)
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


env:
  macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
gamepad:
  "54c-ce6-DualSense Wireless Controller"
buttons:
  - x        -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6
  - R2 -> 7
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press -> -
  - PS logo                      -> 16
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
  - L2                      -> -
  - R2                      -> -
  - dpad -> -


env:
  macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
  macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
gamepad:
  "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)"
buttons:
  - x        -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6 ("touched: true" if half-pressed)
  - R2 -> 7 ("touched: true" if half-pressed)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press -> 17
  - PS logo                      -> 16
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
  - L2                      -> -
  - R2                      -> -
  - dpad -> -
  - dpad -> -


env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
gamepad:
  "054c-0ce6-Wireless Controller"
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
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - L2                      -> 3 (idle -1.00 : 1.00 pushed)
  - R2                      -> 4 (idle -1.00 : 1.00 pushed)
  - dpad -> -


env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
gamepad:
  "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)"
buttons:
  - x        -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6 ("touched: true" if half-pressed)
  - R2 -> 7 ("touched: true" if half-pressed)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press -> 17
  - PS logo                      -> 16
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
  - L2                      -> -
  - R2                      -> -
  - dpad -> -
 */

// Constants for DualSense calculations. Not inside the class for sake of access brevity.
const ds = {
  dpadAxisIndex: 4,
  dpadStep: 2 / 7,
  dpadRangeThreshold: 0.25 * (2 / 7),
};

export type GamepadType = "xbox" | "dualsense" | "other";

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

  readonly #axisThreshold: number = 0.6;

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

  readonly #gamepads: Map<number, Gamepad> = new Map();

  startListening(): void {
    window.addEventListener("gamepadconnected", (gamepadEvent) => {
      this.#gamepads.set(gamepadEvent.gamepad.index, gamepadEvent.gamepad);
    });
    window.addEventListener("gamepaddisconnected", (gamepadEvent) => {
      this.#gamepads.delete(gamepadEvent.gamepad.index);
    });
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let wasAnyEventDetected = false;

    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed || button.touched) {
            const gameInputEvent = this.buttonMapping.get(buttonIndex);
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
              wasAnyEventDetected = true;
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
                  wasAnyEventDetected = true;
                }
              },
            );
          } else {
            if (Math.abs(axis) > this.#axisThreshold) {
              const gameInputEvent = this.#axisMapping.get(
                100 * axisIndex + Math.sign(axis),
              );
              if (gameInputEvent) {
                eventsCollector.add(gameInputEvent);
                wasAnyEventDetected = true;
              }
            }
          }
        });
      }
    });

    return wasAnyEventDetected;
  }

  connectedGamepadTypes(): Set<GamepadType> {
    const types: Set<GamepadType> = new Set();
    for (const gamepad of this.#gamepads.values()) {
      types.add(GamepadTypeDetector.detect(gamepad));
    }
    return types;
  }
}
