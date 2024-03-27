import { b_, rgb_p8_, timer_, u_, v_ } from "../../../src";

export class Movement {
  #timer = timer_(b_.canvasSize.x, { loop: true });

  pause() {
    this.#timer.pause();
  }

  resume() {
    this.#timer.resume();
  }

  draw() {
    b_.drawEllipseFilled(
      v_(
        this.#timer.t,
        b_.canvasSize.y * (0.5 + 0.5 * u_.trigCos(this.#timer.progress)),
      ).sub(2),
      v_(4),
      rgb_p8_.ember,
    );
  }
}
