import { b_, BpxRgbColor, spr_, v_, v_0_0_ } from "../../../src";

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: 30,
    debugFeatures: !BEETPX__IS_PROD,
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

    logoPositionBase = logoPositionBase.add(
      b_.areDirectionsPressedAsVector().mul(velocity),
    );

    logoPositionOffset = v_(
      Math.cos((b_.frameNumber / 30) * Math.PI),
      Math.sin((b_.frameNumber / 30) * Math.PI),
    ).mul(10);

    if (b_.wasJustPressed("menu")) {
      b_.restart();
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(BpxRgbColor.fromCssHex("#754665"));
    b_.sprite(
      spr_("logo.png")(0, 0, 16, 16),
      logoPositionBase.add(logoPositionOffset),
      logoScale,
    );
    if (b_.debug) {
      b_.line(
        v_(0, 0),
        logoPositionBase.add(logoPositionOffset),
        BpxRgbColor.fromCssHex("#ff0000"),
      );
    }
  });

  startGame();
});
