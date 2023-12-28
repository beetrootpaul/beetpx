import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

/*

env:
  macOS Sonoma 14.1.1 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
  macOS Sonoma 14.1.1 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
  macOS Sonoma 14.1.1 (Apple M1 Max), Chrome 120.0.6099.129 (Official Build) (arm64)
  macOS Sonoma 14.1.1 (Apple M1 Max), Edge 120.0.2210.91 (Official build) (arm64)
  macOS Sonoma 14.1.1 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
  macOS Sonoma 14.1.1 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
gamepad:
  8BitDo Lite 2
gamepad ID:
  "8BitDo Lite 2 (Vendor: 2dc8 Product: 5112)"
buttons:
  - A -> 0
  - B -> 1
  - X -> 3
  - Y -> 4
  - L  -> 6
  - R  -> 7
  - L2 -> 8
  - R2 -> 9
  - dpad up    -> -
  - dpad down  -> -
  - dpad left  -> -
  - dpad right -> -
  - 8BitDo logo -> 12
  - star        ->  -
  - minus       -> 10
  - plus        -> 11
  - left  stick pressed -> 13
  - right stick pressed -> 14
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - L2                      -> 4 (idle -1.00 : 1.00 pushed, no mid values)
  - R2                      -> 3 (idle -1.00 : 1.00 pushed, no mid values)
  - dpad -> 9 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 -           0.00 (there is no 0.00)
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 IDLE        1.29
              )

env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.61.109 Chromium: 120.0.6099.144 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 120.0.6099.130 (Oficjalna wersja) (64-bitowa)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 120.0.2210.91 (Official build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 105.0.4970.60)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.5.3206.48 (Stable channel) (64-bit)
gamepad:
  8BitDo Lite 2
gamepad ID:
  "Bluetooth Wireless Controller    (Vendor: 2dc8 Product: 5112)"
buttons:
  - A -> 0
  - B -> 1
  - X -> 3
  - Y -> 4
  - L  -> 6
  - R  -> 7
  - L2 -> 8
  - R2 -> 9
  - dpad up    -> -
  - dpad down  -> -
  - dpad left  -> -
  - dpad right -> -
  - 8BitDo logo -> 12
  - star        ->  -
  - minus       -> 10
  - plus        -> 11
  - left  stick pressed -> 13
  - right stick pressed -> 14
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - L2                      -> 4 (idle -1.00 : 1.00 pushed, no mid values)
  - R2                      -> 3 (idle -1.00 : 1.00 pushed, no mid values)
  - dpad -> 9 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 -           0.00 (there is no 0.00)
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 IDLE        1.29
              )

 */

export class GamepadMapping8BitDo implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 0: // A
      case 4: // Y
        return "button_a";
      case 1: // B
      case 3: // X
        return "button_b";
      case 10: // minus
      case 11: // plus
        return "button_menu";
    }

    return null;
  }

  eventsForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent[] {
    // Let's handle d-pad first:
    if (axisIndex === 9) {
      // Transform
      //      up | up-right | right | down-right |    - | down | down-left | left | up-left | IDLE
      // from
      //   -1.00 |    -0.71 | -0.43 |      -0.14 | 0.00 | 0.14 |      0.43 | 0.71 |    1.00 | 1.29
      // to
      //       1 |        3 |     5 |          7 |    8 |    9 |        11 |   13 |      15 |   17
      // where 0.5 means a half of 1/8 turn, which we can use as a simple threshold
      // to detect values close to a given 1/8 turn direction.
      const normalizedValue = axisValue * (14 / 2) + 8;

      // Now, 0.5 is a maximum allowed offset to prevent overlap between
      //   down-right (7 -> 6.5-7.5),
      //   IDLE (8 -> 7.5-8.5),
      //   and down-left (9 -> 8.5-9.5).
      // Let's use it to detect values we do not care about.
      if (
        normalizedValue < 0.5 ||
        normalizedValue > 15.5 ||
        (normalizedValue > 7.5 && normalizedValue < 8.5)
      ) {
        return [];
      }

      const whichOneEight = Math.round(normalizedValue);
      switch (whichOneEight) {
        case 1:
          return ["button_up"];
        case 3:
          return ["button_up", "button_right"];
        case 5:
          return ["button_right"];
        case 7:
          return ["button_down", "button_right"];
        case 9:
          return ["button_down"];
        case 11:
          return ["button_down", "button_left"];
        case 13:
          return ["button_left"];
        case 15:
          return ["button_up", "button_left"];
        default:
          return [];
      }
    }

    switch (axisIndex) {
      case 0: // left stick, horizontal
      case 2: // right stick, horizontal
        return axisValue > GamepadMapping8BitDo.#stickAxisThreshold
          ? ["button_right"]
          : axisValue < -GamepadMapping8BitDo.#stickAxisThreshold
            ? ["button_left"]
            : [];
      case 1: // left stick, vertical
      case 5: // right stick, vertical
        return axisValue > GamepadMapping8BitDo.#stickAxisThreshold
          ? ["button_down"]
          : axisValue < -GamepadMapping8BitDo.#stickAxisThreshold
            ? ["button_up"]
            : [];
      default:
        return [];
    }
  }
}
