import {
  b_,
  BpxDrawingPattern,
  BpxEasing,
  BpxTimerSequence,
  rgb_p8_,
  timerSeq_,
  v_,
} from "../../../src";

export class Vfx {
  static #checkersPattern = BpxDrawingPattern.from(`
    #-#-
    -#-#
    #-#-
    -#-#
  `);

  #loopFrames: number;
  #timer: BpxTimerSequence<"a" | "b">;

  constructor(params: { loopFrames: number }) {
    // this.#timer = timer_(params.loopFrames, { loop: true });
    this.#loopFrames = params.loopFrames;
    this.#timer = timerSeq_({
      intro: [
        ["a", params.loopFrames - 5],
        ["b", 2],
      ],
      loop: [
        ["a", params.loopFrames - 2],
        ["b", 2],
      ],
    });
  }

  draw() {
    b_.setDrawingPattern(Vfx.#checkersPattern);
    [
      v_(2, 2),
      v_(2, b_.canvasSize.y - 8),
      v_(b_.canvasSize.x - 8, 2),
      v_(b_.canvasSize.x - 8, b_.canvasSize.y - 8),
    ].forEach((xy) => {
      const progress =
        (this.#loopFrames - this.#timer.framesLeft) / this.#loopFrames;
      b_.drawRectFilled(
        xy,
        v_(6, 6).mul(BpxEasing.outQuadratic(progress)),
        this.#timer.currentPhase === "a" ? rgb_p8_.moss : rgb_p8_.orange,
      );
    });
    b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }
}
