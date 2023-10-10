import { b_, BpxSolidColor, BpxVector2d, spr_, v_ } from "../../../src";

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: 30,
    visibleTouchButtons: ["left", "right", "up", "down", "x", "o", "menu"],
    debugFeatures: !__BEETPX_IS_PROD__,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.wav" }, { url: "music_melody.wav" }],
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
  let logoPositionBase = BpxVector2d.zero;
  let logoPositionOffset = BpxVector2d.zero;

  b_.setOnStarted(() => {
    b_.stopAllSounds();
    b_.playSoundLooped("music_base.wav");
    melodyPlaybackId = b_.playSoundLooped("music_melody.wav", true);

    logoPositionBase = logoPositionBaseDefault;
    logoPositionOffset = BpxVector2d.zero;
  });

  b_.setOnUpdate(() => {
    if (b_.wasJustPressed("x")) {
      b_.unmuteSound(melodyPlaybackId);
    }
    if (b_.wasJustPressed("o")) {
      b_.muteSound(melodyPlaybackId);
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
