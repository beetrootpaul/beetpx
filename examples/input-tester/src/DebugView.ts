import { b_, BpxSolidColor, spr_, u_, v_, v_0_0_ } from "../../../src";

const spr = spr_("spritesheet.png");

const red = BpxSolidColor.fromRgbCssHex("#ff004d");

export class DebugView {
  private readonly buttonsN = 20;
  private readonly axesN = 6;
  private readonly buttons: (null | "touched" | "pressed")[] = u_
    .range(this.buttonsN)
    .map(() => null);
  private readonly axes: (null | number)[] = u_
    .range(this.axesN)
    .map(() => null);

  constructor() {
    document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
      if (b_.debug) {
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
      }
    });
    document.addEventListener("keyup", (keyboardEvent: KeyboardEvent) => {
      if (b_.debug) {
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
      }
    });
  }

  update(): void {
    console.group("UPDATE", Date.now());

    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        console.table({
          table: "GAMEPAD STATUS",
          id: gamepad.id,
          connected: gamepad.connected,
          index: gamepad.index,
          "#axes": gamepad.axes.length,
          "#buttons": gamepad.buttons.length,
          ...gamepad.axes.reduce(
            (acc, a, i) => ({
              ...acc,
              [`axis ${i}`]: a,
            }),
            {},
          ),
          ...gamepad.buttons.reduce(
            (acc, b, i) => ({
              ...acc,
              [`button ${i}`]: `pressed=${b.pressed} | touched=${b.touched} | value=${b.value}`,
            }),
            {},
          ),
          timestamp: gamepad.timestamp,
        });

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
    });

    console.groupEnd();
  }

  draw() {
    // background
    b_.sprite(spr(160, 0, 128, 128), v_0_0_);

    // buttons
    this.buttons.forEach((button, i) => {
      if (button === "pressed") {
        b_.rectFilled(
          v_(17 + (i % 10) * 10, 24 + Math.floor(i / 10) * 16),
          v_(3, 3),
          red,
        );
      } else if (button === "touched") {
        b_.ellipseFilled(
          v_(17 + (i % 10) * 10, 24 + Math.floor(i / 10) * 16),
          v_(3, 3),
          red,
        );
      }
    });

    // axes
    this.axes.forEach((axe, i) => {
      if (axe != null) {
        const offset = 20 * axe;
        b_.rectFilled(v_(62 + offset, 63 + i * 10), v_(3, 3), red);
      }
    });
  }
}
