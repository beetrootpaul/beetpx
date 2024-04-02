import { aspr_, b_, timer_, u_, v_ } from "../../../src";

export class Movement {
  static assetUrls = ["animation.png"];

  #timer = timer_(b_.canvasSize.x, { loop: true });
  #animation = aspr_("animation.png")(
    48,
    48,
    u_.repeatEachElement(
      4,
      u_.range(12).map((i) => [48 * i, 0]),
    ),
  );

  pause() {
    this.#timer.pause();
    this.#animation.pause();
  }

  resume() {
    this.#timer.resume();
    this.#animation.resume();
  }

  draw() {
    b_.drawSprite(
      this.#animation.current,
      v_(
        this.#timer.t,
        b_.canvasSize.y * (0.5 + 0.5 * u_.trigCos(this.#timer.progress)),
      ),
      { centerXy: [true, true] },
    );
  }
}
