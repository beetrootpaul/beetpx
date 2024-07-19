import { $, $aspr, $d, $h, $timer, $v } from "../../../src";

export class Movement {
  static assetUrls = ["animation.png"];

  #timer = $timer($.canvasSize.x, { loop: true });
  #animation = $aspr("animation.png")(
    48,
    48,
    $h.repeatEachElement(
      4,
      $h.range(12).map((i) => [48 * i, 0]),
    ),
  );

  draw(): void {
    $d.sprite(
      this.#animation.current,
      $v(
        this.#timer.t,
        $.canvasSize.y * (0.5 + 0.5 * $h.trigCos(this.#timer.progress)),
      ),
      { centerXy: [true, true] },
    );
  }
}
