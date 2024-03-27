import {
  b_,
  BpxDrawingPattern,
  BpxEasing,
  BpxTimer,
  rgb_p8_,
  timer_,
  v_,
} from "../../../src";

export class Vfx {
  static #checkersPattern = BpxDrawingPattern.from(`
    #-#-
    -#-#
    #-#-
    -#-#
  `);

  constructor(params: { loopFrames: number }) {
    this.#timer = timer_(params.loopFrames, { loop: true });
  }

  #timer: BpxTimer;

  draw() {
    b_.setDrawingPattern(Vfx.#checkersPattern);
    [
      v_(2, 2),
      v_(2, b_.canvasSize.y - 8),
      v_(b_.canvasSize.x - 8, 2),
      v_(b_.canvasSize.x - 8, b_.canvasSize.y - 8),
    ].forEach((xy) => {
      b_.drawRectFilled(
        xy,
        v_(6, 6).mul(BpxEasing.outQuadratic(this.#timer.progress)),
        rgb_p8_.moss,
      );
    });
    b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }
}
