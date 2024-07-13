import {
  b_,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
  rgb_,
  rgb_p8_,
  v_,
  v_0_0_,
} from "../../../src";

export class PauseOverlay {
  static #dimColors: BpxColorMapper = (sourceColor) =>
    !sourceColor
      ? null
      : rgb_(sourceColor.r * 0.5, sourceColor.g * 0.5, sourceColor.b * 0.5);

  draw() {
    b_.takeCanvasSnapshot();
    b_.drawRectFilled(
      v_0_0_,
      b_.canvasSize,
      BpxCanvasSnapshotColorMapping.of(PauseOverlay.#dimColors),
    );
    const { wh, offset } = b_.measureText("pause", {
      centerXy: [true, true],
    });
    b_.drawRectFilled(
      b_.canvasSize.div(2).add(offset).sub(2),
      wh.add(4),
      rgb_p8_.black,
    );
    b_.drawText("pause", b_.canvasSize.div(2), rgb_p8_.white, {
      centerXy: [true, true],
      scaleXy: v_(4, 4),
    });
  }
}
