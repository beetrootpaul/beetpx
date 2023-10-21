import { b_, BpxSolidColor, spr_, u_, v_, v_0_0_ } from "../../../src";
import { GamepadType } from "../../../src/game_input/GamepadGameInput";
import { GamepadTypeDetector } from "../../../src/game_input/GamepadTypeDetector";

const spr = spr_("spritesheet.png");

const orange = BpxSolidColor.fromRgbCssHex("#ffa300");
const blue = BpxSolidColor.fromRgbCssHex("#29adff");
const lime = BpxSolidColor.fromRgbCssHex("#00e436");

export class DebugView {
  private readonly gamepadsN = 3;

  private readonly gamepadTypes: (null | GamepadType)[] = u_
    .range(this.gamepadsN)
    .map(() => null);

  private readonly buttonsN = 20;
  private readonly buttons: (null | "touched" | "pressed")[][] = u_
    .range(this.buttonsN)
    .map(() => u_.range(this.gamepadsN).map(() => null));

  private readonly axesN = 7;
  private readonly axes: (null | number)[][] = u_
    .range(this.axesN)
    .map(() => u_.range(this.gamepadsN).map(() => null));

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
          GamepadTypeDetector.detect(gamepadEvent.gamepad);
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
        u_.range(this.buttonsN).forEach((i) => {
          this.buttons[i]![gamepad.index] = gamepad.buttons[i]?.pressed
            ? "pressed"
            : gamepad.buttons[i]?.touched
            ? "touched"
            : null;
        });
        u_.range(this.axesN).forEach((i) => {
          this.axes[i]![gamepad.index] = gamepad.axes[i] ?? null;
        });
      }
    });
  }

  draw() {
    // background
    b_.sprite(spr(160, 0, 128, 128), v_0_0_);

    // buttons
    this.buttons.forEach((buttonXGamepads, buttonIndex) => {
      buttonXGamepads.forEach((button, gamepadIndex) => {
        if (button === "pressed") {
          b_.rectFilled(
            v_(
              17 + (buttonIndex % 10) * 10,
              12 + Math.floor(buttonIndex / 10) * 20 + gamepadIndex * 3,
            ),
            v_(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        } else if (button === "touched") {
          b_.ellipseFilled(
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
          b_.rectFilled(
            v_(48 + offset, 51 + axisIndex * 11 + gamepadIndex * 3),
            v_(3, 3),
            gamepadIndex === 0 ? orange : gamepadIndex === 1 ? blue : lime,
          );
        }
      });
    });

    // gamepad types
    u_.range(this.gamepadsN).forEach((gamepadIndex) => {
      const gamepadType = this.gamepadTypes[gamepadIndex];
      if (gamepadType) {
        b_.rectFilled(
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
  }
}
