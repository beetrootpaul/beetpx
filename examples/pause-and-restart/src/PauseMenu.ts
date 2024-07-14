import {
  b_,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
  rgb_,
  rgb_p8_,
  v_,
  v_0_0_,
} from "../../../src";

export class PauseMenu {
  static #dimColors: BpxColorMapper = (sourceColor) =>
    !sourceColor
      ? null
      : rgb_(sourceColor.r * 0.35, sourceColor.g * 0.35, sourceColor.b * 0.35);

  #selectedItem = 0;

  update() {
    if (b_.wasJustPaused) {
      this.#selectedItem = 0;
    }

    if (b_.wasButtonJustPressed("a")) {
      if (this.#selectedItem === 0) {
        b_.resume();
      } else if (this.#selectedItem === 1) {
        if (b_.isAudioMuted()) {
          b_.unmuteAudio();
        } else {
          b_.muteAudio();
        }
      } else if (this.#selectedItem === 2) {
        b_.restart();
      }
    }

    if (b_.wasButtonJustPressed("b")) {
      b_.resume();
    }

    if (b_.wasButtonJustPressed("down")) {
      this.#selectedItem += 1;
    }
    if (b_.wasButtonJustPressed("up")) {
      this.#selectedItem -= 1;
    }
  }

  draw() {
    b_.takeCanvasSnapshot();
    b_.drawRectFilled(
      v_0_0_,
      b_.canvasSize,
      BpxCanvasSnapshotColorMapping.of(PauseMenu.#dimColors),
    );

    const xy = (itemIndex: number) =>
      v_(8 + (this.#selectedItem === itemIndex ? 4 : 0), 8 + itemIndex * 20);
    const color = (itemIndex: number) =>
      this.#selectedItem === itemIndex ? rgb_p8_.white : rgb_p8_.slate;
    const opts = { scaleXy: v_(3, 3) };
    b_.drawText("resume", xy(0), color(0), opts);
    b_.drawText(b_.isAudioMuted() ? "unmute" : "mute", xy(1), color(1), opts);
    b_.drawText("restart", xy(2), color(2), opts);
  }
}
