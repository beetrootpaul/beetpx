import {
  b_,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
  rgb_,
  rgb_p8_,
  v_0_0_,
} from "../../../src";

let isPaused = false;

const dimColors: BpxColorMapper = (sourceColor) =>
  !sourceColor
    ? null
    : rgb_(sourceColor.r * 0.7, sourceColor.g * 0.7, sourceColor.b * 0.7);

b_.init({
  config: {
    canvasSize: "64x64",
  },
  onStarted() {
    // TODO: example of a game reset and a need to re-init the non-pause state
    // isPaused = false;
  },
  onUpdate() {
    if (b_.wasButtonJustPressed("menu")) {
      isPaused = !isPaused;
    }
  },
  onDraw() {
    b_.clearCanvas(rgb_p8_.storm);

    if (isPaused) {
      b_.takeCanvasSnapshot();
      b_.drawRectFilled(
        v_0_0_,
        b_.canvasSize,
        BpxCanvasSnapshotColorMapping.of(dimColors),
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
      });
    }
  },
});
