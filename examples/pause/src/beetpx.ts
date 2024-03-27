import {
  b_,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
  BpxDrawingPattern,
  BpxEasing,
  rgb_,
  rgb_p8_,
  timer_,
  u_,
  v_,
  v_0_0_,
} from "../../../src";

b_.init({
  canvasSize: "64x64",
  assets: ["music_base.flac", "music_melody.flac"],
}).then(async ({ startGame }) => {
  const movementTimer = timer_(b_.canvasSize.x, { loop: true });
  const melodyBeatFrames = 32;
  const vfxTimer = timer_(melodyBeatFrames, { loop: true });
  let melodyPlaybackId: number | undefined;

  let isPaused = false;

  const dimColors: BpxColorMapper = (sourceColor) =>
    !sourceColor
      ? null
      : rgb_(sourceColor.r * 0.5, sourceColor.g * 0.5, sourceColor.b * 0.5);

  const checkersPattern = BpxDrawingPattern.from(`
    #-#-
    -#-#
    #-#-
    -#-#
  `);

  b_.setOnStarted(() => {
    isPaused = false;
    b_.startPlaybackLooped("music_base.flac");
    melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac");
  });

  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a") || b_.wasButtonJustPressed("b")) {
      b_.restart();
    }

    if (b_.wasButtonJustPressed("menu")) {
      isPaused = !isPaused;
      if (isPaused) {
        movementTimer.pause();
        if (melodyPlaybackId) {
          b_.mutePlayback(melodyPlaybackId);
        }
      } else {
        movementTimer.resume();
        if (melodyPlaybackId) {
          b_.unmutePlayback(melodyPlaybackId);
        }
      }
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.storm);
    drawVfx();
    drawMovement();
    if (isPaused) {
      drawPauseScreen();
    }
  });

  function drawVfx() {
    b_.setDrawingPattern(checkersPattern);
    [
      v_(2, 2),
      v_(2, b_.canvasSize.y - 8),
      v_(b_.canvasSize.x - 8, 2),
      v_(b_.canvasSize.x - 8, b_.canvasSize.y - 8),
    ].forEach((xy) => {
      b_.drawRectFilled(
        xy,
        v_(6, 6).mul(BpxEasing.outQuadratic(vfxTimer.progress)),
        rgb_p8_.moss,
      );
    });
    b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }

  function drawMovement() {
    b_.drawEllipseFilled(
      v_(
        movementTimer.t,
        b_.canvasSize.y * (0.5 + 0.5 * u_.trigCos(movementTimer.progress)),
      ).sub(2),
      v_(4),
      rgb_p8_.ember,
    );
  }

  function drawPauseScreen() {
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

  await startGame();
});
