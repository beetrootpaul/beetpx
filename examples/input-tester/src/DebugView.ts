import { b_, BpxSolidColor, spr_, u_, v_, v_0_0_ } from "../../../src";

const spr = spr_("spritesheet.png");

const red = BpxSolidColor.fromRgbCssHex("#ff004d");

export class DebugView {
  private readonly gamepads: Map<number, Gamepad> = new Map();

  private readonly buttonsN = 20;
  private readonly axesN = 7;
  private readonly buttons: (null | "touched" | "pressed")[] = u_
    .range(this.buttonsN)
    .map(() => null);
  private readonly axes: (null | number)[] = u_
    .range(this.axesN)
    .map(() => null);

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
      this.gamepads.set(gamepadEvent.gamepad.index, gamepadEvent.gamepad);
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
      this.gamepads.delete(gamepadEvent.gamepad.index);
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
    for (const gamepad of this.gamepads.values()) {
      u_.range(this.buttonsN).forEach((i) => {
        this.buttons[i] = gamepad.buttons[i]?.pressed
          ? "pressed"
          : gamepad.buttons[i]?.touched
          ? "touched"
          : null;
      });
      u_.range(this.axesN).forEach((i) => {
        this.axes[i] = gamepad.axes[i] ?? null;
      });
    }
  }

  draw() {
    // background
    b_.sprite(spr(160, 0, 128, 128), v_0_0_);

    // buttons
    this.buttons.forEach((button, i) => {
      if (button === "pressed") {
        b_.rectFilled(
          v_(17 + (i % 10) * 10, 20 + Math.floor(i / 10) * 16),
          v_(3, 3),
          red,
        );
      } else if (button === "touched") {
        b_.ellipseFilled(
          v_(17 + (i % 10) * 10, 20 + Math.floor(i / 10) * 16),
          v_(3, 3),
          red,
        );
      }
    });

    // axes
    this.axes.forEach((axe, i) => {
      if (axe != null) {
        const offset = 20 * axe;
        b_.rectFilled(v_(62 + offset, 57 + i * 10), v_(3, 3), red);
      }
    });
  }
}
