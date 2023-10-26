import { b_, BpxSolidColor, spr_, v_, v_0_0_ } from "../../../src";

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: 30,
    visibleTouchButtons: ["left", "right", "up", "down", "a", "b", "menu"],
    canvasContextType: "2d",
    debugFeatures: !__BEETPX_IS_PROD__,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.flac" }, { url: "music_melody.flac" }],
    jsons: [],
  },
).then(({ startGame }) => {
  let melodyPlaybackId: number = -1;

  const velocity = 2;

  const logoScale = v_(2, 2);

  const logoPositionBaseDefault = v_(
    (128 - 16 * logoScale.x) / 2,
    (128 - 16 * logoScale.y) / 2,
  );
  let logoPositionBase = v_0_0_;
  let logoPositionOffset = v_0_0_;

  let isMelodyMuted = true;
  let isMusicPaused = false;

  b_.setOnStarted(() => {
    isMelodyMuted = true;
    isMusicPaused = false;

    b_.playSoundLooped("music_base.flac");
    melodyPlaybackId = b_.playSoundLooped("music_melody.flac", isMelodyMuted);

    logoPositionBase = logoPositionBaseDefault;
    logoPositionOffset = v_0_0_;
  });

  b_.setOnUpdate(() => {
    if (b_.wasJustPressed("a")) {
      if (isMelodyMuted) {
        b_.unmutePlayback(melodyPlaybackId, { fadeInMillis: 500 });
      } else {
        b_.mutePlayback(melodyPlaybackId, { fadeOutMillis: 500 });
      }
      isMelodyMuted = !isMelodyMuted;
    }
    if (b_.wasJustPressed("b")) {
      if (isMusicPaused) {
        b_.resumeAudio();
      } else {
        b_.pauseAudio();
      }
      isMusicPaused = !isMusicPaused;
    }

    // TODO: consider exposing some XY (-1,1) representation of directions
    if (b_.isPressed("right")) {
      logoPositionBase = logoPositionBase.add(velocity, 0);
    }
    if (b_.isPressed("left")) {
      logoPositionBase = logoPositionBase.add(-velocity, 0);
    }
    if (b_.isPressed("up")) {
      logoPositionBase = logoPositionBase.add(0, -velocity);
    }
    if (b_.isPressed("down")) {
      logoPositionBase = logoPositionBase.add(0, velocity);
    }

    logoPositionOffset = v_(
      Math.cos((b_.frameNumber / 30) * Math.PI),
      Math.sin((b_.frameNumber / 30) * Math.PI),
    ).mul(10);

    if (b_.wasJustPressed("menu")) {
      b_.restart();
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(BpxSolidColor.fromRgbCssHex("#754665"));
    b_.sprite(
      spr_("logo.png")(0, 0, 16, 16),
      logoPositionBase.add(logoPositionOffset),
      logoScale,
    );
    if (b_.debug) {
      b_.line(
        v_(0, 0),
        logoPositionBase.add(logoPositionOffset),
        BpxSolidColor.fromRgbCssHex("#ff0000"),
      );
    }
  });

  startGame();
});
