import {
  b_,
  BpxCanvasSnapshotColorMapping,
  BpxColorMapper,
  BpxDrawingPattern,
  BpxEasing,
  BpxTimer,
  rgb_,
  rgb_p8_,
  timer_,
  u_,
  v_,
  v_0_0_,
} from "../../../src";

let isPaused = false;
let movementTimer: BpxTimer;
let vfxTimer: BpxTimer;
let melodyPlaybackId: number;

b_.init({
  config: {
    canvasSize: "64x64",
    assets: ["music_base.flac", "music_melody.flac"],
  },

  onStarted() {
    isPaused = false;
    
    // TODO: move construction outside onStarted, then `.reset()` here
    movementTimer = timer_(b_.canvasSize.x, { loop: true });

    const melodyBeatFrames = 32;
    vfxTimer = timer_(melodyBeatFrames, { loop: true });

    b_.startPlaybackLooped("music_base.flac");
    melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac");
  },

  onUpdate() {
    if (b_.wasButtonJustPressed("a") || b_.wasButtonJustPressed("b")) {
      b_.restart();
    }

    if (b_.wasButtonJustPressed("menu")) {
      isPaused = !isPaused;

      if (isPaused) {
        movementTimer.pause();
        b_.mutePlayback(melodyPlaybackId);
      } else {
        movementTimer.resume();
        b_.unmutePlayback(melodyPlaybackId);
      }
    }
  },

  onDraw() {
    b_.clearCanvas(rgb_p8_.storm);
    drawVfx();
    drawMovement();
    if (isPaused) {
      drawPauseScreen();
    }
  },
});

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
