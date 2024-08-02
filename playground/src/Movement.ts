import { $, $aspr, $d, $timer, $u, $v } from "../../src";

export class Movement {
  static assetUrls = ["animation.png"];

  #timer = $timer($.canvasSize.x, { loop: true });
  #animation = $aspr("animation.png")(
    48,
    48,
    $u.range(12).map((i) => [48 * i, 0]),
    { frameDuration: 4 },
  );

  draw(): void {
    $d.sprite(
      this.#animation.current,
      $v(
        this.#timer.t,
        $.canvasSize.y * (0.5 + 0.5 * $u.trigCos(this.#timer.progress)),
      ),
      { centerXy: [true, true] },
    );
  }
}
