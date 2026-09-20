import {
  $d,
  $rgb_p8,
  $timerSeq,
  $v,
  $x,
  BpxDrawingPattern,
  BpxEasing,
  BpxTimerSequence,
} from "../../src";

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
    this.#timer = $timerSeq(
      {
        intro: [
          ["a", params.loopFrames - 9],
          ["b", 2],
        ],
        loop: [
          ["a", params.loopFrames - 2],
          ["b", 2],
        ],
      },
      {
        onGamePause: "ignore",
      },
    );
  }

  draw() {
    $d.setDrawingPattern(Vfx.#checkersPattern);

    const rectSize = 16;
    [
      $v(2, 2),
      $v(2, $x.canvasSize.y - rectSize - 2),
      $v($x.canvasSize.x - rectSize - 2, 2),
      $v($x.canvasSize.x - rectSize - 2, $x.canvasSize.y - rectSize - 2),
    ].forEach((xy) => {
      const progress =
        (this.#loopFrames - this.#timer.framesLeft) / this.#loopFrames;
      $d.rectFilled(
        xy,
        $v(rectSize).mul(BpxEasing.outQuadratic(progress)),
        this.#timer.currentPhase === "a" ? $rgb_p8.moss : $rgb_p8.orange,
      );
    });
    $d.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }
}
