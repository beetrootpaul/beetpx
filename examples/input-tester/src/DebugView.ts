import {
  $,
  $d,
  $h,
  $rgb,
  $spr,
  $v,
  $v_0_0,
  BpxGamepadType,
  BpxGamepadTypeDetector,
} from "../../../src";

const orange = $rgb("#ffa300");
const blue = $rgb("#29adff");
const lime = $rgb("#00e436");
const pink = $rgb("#ff77a8");

export class DebugView {
  private readonly gamepadsN = 3;

  private readonly gamepadTypes: (null | BpxGamepadType)[] = $h
    .range(this.gamepadsN)
    .map(() => null);

  private readonly buttonsN = 20;
  private readonly buttons: (null | "touched" | "pressed")[][] = $h
    .range(this.buttonsN)
    .map(() => $h.range(this.gamepadsN).map(() => null));

  private readonly axesN = 7;
  private readonly axes: (null | number)[][] = $h
    .range(this.axesN)
    .map(() => $h.range(this.gamepadsN).map(() => null));

  constructor() {
    document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
      console.table({
        table: "KEYBOARD EVENT",
        type: "keydown",
        code: keyboardEvent.code,
        ctrlKey: keyboardEvent.ctrlKey,
        isComposing: keyboardEvent.isComposing,
        key: keyboardEvent.key,
        location: keyboardEvent.location,
        metaKey: keyboardEvent.metaKey,
        repeat: keyboardEvent.repeat,
        shiftKey: keyboardEvent.shiftKey,
      });
    });
    document.addEventListener("keyup", (keyboardEvent: KeyboardEvent) => {
      console.table({
        table: "KEYBOARD EVENT",
        type: "keyup",
        code: keyboardEvent.code,
        ctrlKey: keyboardEvent.ctrlKey,
        isComposing: keyboardEvent.isComposing,
        key: keyboardEvent.key,
        location: keyboardEvent.location,
        metaKey: keyboardEvent.metaKey,
        repeat: keyboardEvent.repeat,
        shiftKey: keyboardEvent.shiftKey,
      });
    });

    window.addEventListener("gamepadconnected", (gamepadEvent) => {
      if (gamepadEvent.gamepad.index < this.gamepadsN) {
        this.gamepadTypes[gamepadEvent.gamepad.index] =
          BpxGamepadTypeDetector.detect(gamepadEvent.gamepad);
      }
      console.table({
        table: "GAMEPAD EVENT",
        type: "gamepadconnected",
        id: gamepadEvent.gamepad.id,
        index: gamepadEvent.gamepad.index,
        connected: gamepadEvent.gamepad.connected,
        "#axes": gamepadEvent.gamepad.axes.length,
        "#buttons": gamepadEvent.gamepad.buttons.length,
        timestamp: gamepadEvent.gamepad.timestamp,
      });
    });
    window.addEventListener("gamepaddisconnected", (gamepadEvent) => {
      if (gamepadEvent.gamepad.index < this.gamepadsN) {
        this.gamepadTypes[gamepadEvent.gamepad.index] = null;
      }
      console.table({
        table: "GAMEPAD EVENT",
        type: "gamepaddisconnected",
        id: gamepadEvent.gamepad.id,
        index: gamepadEvent.gamepad.index,
        connected: gamepadEvent.gamepad.connected,
        "#axes": gamepadEvent.gamepad.axes.length,
        "#buttons": gamepadEvent.gamepad.buttons.length,
        timestamp: gamepadEvent.gamepad.timestamp,
      });
    });
  }

  update(): void {
    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad && gamepad.index < this.gamepadsN) {
        $h.range(this.buttonsN).forEach((i) => {
          this.buttons[i]![gamepad.index] = gamepad.buttons[i]?.pressed
            ? "pressed"
            : gamepad.buttons[i]?.touched
              ? "touched"
              : null;
        });
        $h.range(this.axesN).forEach((i) => {
          this.axes[i]![gamepad.index] = gamepad.axes[i] ?? null;
        });
      }
    });
  }

  draw() {
    // background
    $d.sprite($spr("spritesheet.png")(128, 128, 160, 0), $v_0_0);

    // buttons
    this.buttons.forEach((buttonXGamepads, buttonIndex) => {
      buttonXGamepads.forEach((button, gamepadIndex) => {
        if (button === "pressed") {
          $d.rectFilled(
            $v(
              17 + (buttonIndex % 10) * 10,
              12 + Math.floor(buttonIndex / 10) * 20 + gamepadIndex * 3,
            ),
            $v(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        } else if (button === "touched") {
          $d.ellipseFilled(
            $v(
              17 + (buttonIndex % 10) * 10,
              12 + Math.floor(buttonIndex / 10) * 20 + gamepadIndex * 3,
            ),
            $v(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        }
      });
    });

    // axes
    this.axes.forEach((axisXGamepad, axisIndex) => {
      axisXGamepad.forEach((axis, gamepadIndex) => {
        if (axis != null) {
          const offset = 20 * axis;
          $d.rectFilled(
            $v(48 + offset, 51 + axisIndex * 11 + gamepadIndex * 3),
            $v(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        }
      });
    });

    // gamepad types
    $h.range(this.gamepadsN).forEach((gamepadIndex) => {
      const gamepadType = this.gamepadTypes[gamepadIndex];
      if (gamepadType) {
        $d.rectFilled(
          $v(
            97 +
              (gamepadType === "xbox"
                ? 0
                : gamepadType === "dualsense"
                  ? 10
                  : 20),
            61 + gamepadIndex * 3,
          ),
          $v(3, 3),
          gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
        );
      }
    });

    // browser type
    $d.rectFilled(
      $v(
        117,
        78 +
          ($.detectedBrowserType === "chromium"
            ? 0
            : $.detectedBrowserType === "safari"
              ? 10
              : $.detectedBrowserType === "firefox_windows"
                ? 20
                : $.detectedBrowserType === "firefox_other"
                  ? 30
                  : 40),
      ),
      $v(3, 3),
      pink,
    );
  }
}
