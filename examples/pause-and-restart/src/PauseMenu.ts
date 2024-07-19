import {
  $,
  $d,
  $rgb,
  $rgb_p8,
  $u,
  $v,
  $v_0_0,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
} from "../../../src";

export class PauseMenu {
  static #dimColors: BpxColorMapper = (sourceColor, _xy) =>
    !sourceColor
      ? null
      : $rgb(sourceColor.r * 0.35, sourceColor.g * 0.35, sourceColor.b * 0.35);

  #selectedItem = 0;

  update() {
    if ($.wasJustPaused) {
      this.#selectedItem = 0;
    }

    if ($.wasButtonJustPressed("a")) {
      if (this.#selectedItem === 0) {
        $.resume();
      } else if (this.#selectedItem === 1) {
        if ($.isAudioMuted()) {
          $.unmuteAudio();
        } else {
          $.muteAudio();
        }
      } else if (this.#selectedItem === 2) {
        $.restart();
      }
    }

    if ($.wasButtonJustPressed("b")) {
      $.resume();
    }

    if ($.wasButtonJustPressed("down")) {
      this.#selectedItem += 1;
    }
    if ($.wasButtonJustPressed("up")) {
      this.#selectedItem -= 1;
    }
    this.#selectedItem = $u.mod(this.#selectedItem, 3);
  }

  draw() {
    $d.takeCanvasSnapshot();
    $d.rectFilled(
      $v_0_0,
      $.canvasSize,
      BpxCanvasSnapshotColorMapping.of(PauseMenu.#dimColors),
    );

    const xy = (itemIndex: number) =>
      $v(8 + (this.#selectedItem === itemIndex ? 4 : 0), 8 + itemIndex * 20);
    const color = (itemIndex: number) =>
      this.#selectedItem === itemIndex ? $rgb_p8.white : $rgb_p8.slate;
    const opts = { scaleXy: $v(3, 3) };
    $d.text("resume", xy(0), color(0), opts);
    $d.text($.isAudioMuted() ? "unmute" : "mute", xy(1), color(1), opts);
    $d.text("restart", xy(2), color(2), opts);
  }
}
