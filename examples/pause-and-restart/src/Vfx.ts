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
    ##--
    ##--
    --##
    --##
  `);

  #loopFrames: number;
  #timer: BpxTimerSequence<"a" | "b">;

  constructor(params: { loopFrames: number }) {
    this.#loopFrames = params.loopFrames;
    this.#timer = timerSeq_(
      {
        intro: [
          ["a", params.loopFrames - 5],
          ["b", 2],
        ],
        loop: [
          ["a", params.loopFrames - 2],
          ["b", 2],
        ],
      },
      {
        ignoreGamePause: true,
      },
    );
  }

  draw() {
    b_.setDrawingPattern(Vfx.#checkersPattern);

    const rectSize = 16;
    [
      v_(2, 2),
      v_(2, b_.canvasSize.y - rectSize - 2),
      v_(b_.canvasSize.x - rectSize - 2, 2),
      v_(b_.canvasSize.x - rectSize - 2, b_.canvasSize.y - rectSize - 2),
    ].forEach((xy) => {
      const progress =
        (this.#loopFrames - this.#timer.framesLeft) / this.#loopFrames;
      b_.drawRectFilled(
        xy,
        v_(rectSize).mul(BpxEasing.outQuadratic(progress)),
        this.#timer.currentPhase === "a" ? rgb_p8_.moss : rgb_p8_.orange,
      );
    });
    b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }
}
