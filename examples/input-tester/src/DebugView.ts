import {
  b_,
  BpxGamepadType,
  BpxGamepadTypeDetector,
  BpxRgbColor,
  spr_,
  v_,
  v_0_0_,
} from "../../../src";
import { range } from "../../../src/utils/range";

const orange = BpxRgbColor.fromCssHex("#ffa300");
const blue = BpxRgbColor.fromCssHex("#29adff");
const lime = BpxRgbColor.fromCssHex("#00e436");
const pink = BpxRgbColor.fromCssHex("#ff77a8");

export class DebugView {
  private readonly gamepadsN = 3;

  private readonly gamepadTypes: (null | BpxGamepadType)[] = range(
    this.gamepadsN,
  ).map(() => null);

  private readonly buttonsN = 20;
  private readonly buttons: (null | "touched" | "pressed")[][] = range(
    this.buttonsN,
  ).map(() => range(this.gamepadsN).map(() => null));

  private readonly axesN = 7;
  private readonly axes: (null | number)[][] = range(this.axesN).map(() =>
    range(this.gamepadsN).map(() => null),
  );

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
        range(this.buttonsN).forEach((i) => {
          this.buttons[i]![gamepad.index] = gamepad.buttons[i]?.pressed
            ? "pressed"
            : gamepad.buttons[i]?.touched
              ? "touched"
              : null;
        });
        range(this.axesN).forEach((i) => {
          this.axes[i]![gamepad.index] = gamepad.axes[i] ?? null;
        });
      }
    });
  }

  draw() {
    // background
    b_.drawSprite(spr_("spritesheet.png")(128, 128, 160, 0), v_0_0_);

    // buttons
    this.buttons.forEach((buttonXGamepads, buttonIndex) => {
      buttonXGamepads.forEach((button, gamepadIndex) => {
        if (button === "pressed") {
          b_.drawRectFilled(
            v_(
              17 + (buttonIndex % 10) * 10,
              12 + Math.floor(buttonIndex / 10) * 20 + gamepadIndex * 3,
            ),
            v_(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        } else if (button === "touched") {
          b_.drawEllipseFilled(
            v_(
              17 + (buttonIndex % 10) * 10,
              12 + Math.floor(buttonIndex / 10) * 20 + gamepadIndex * 3,
            ),
            v_(3, 3),
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
          b_.drawRectFilled(
            v_(48 + offset, 51 + axisIndex * 11 + gamepadIndex * 3),
            v_(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        }
      });
    });

    // gamepad types
    range(this.gamepadsN).forEach((gamepadIndex) => {
      const gamepadType = this.gamepadTypes[gamepadIndex];
      if (gamepadType) {
        b_.drawRectFilled(
          v_(
            97 +
              (gamepadType === "xbox"
                ? 0
                : gamepadType === "dualsense"
                  ? 10
                  : 20),
            61 + gamepadIndex * 3,
          ),
          v_(3, 3),
          gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
        );
      }
    });

    // browser type
    b_.drawRectFilled(
      v_(
        117,
        78 +
          (b_.detectedBrowserType === "chromium"
            ? 0
            : b_.detectedBrowserType === "safari"
              ? 10
              : b_.detectedBrowserType === "firefox_windows"
                ? 20
                : b_.detectedBrowserType === "firefox_other"
                  ? 30
                  : 40),
      ),
      v_(3, 3),
      pink,
    );
  }
}
