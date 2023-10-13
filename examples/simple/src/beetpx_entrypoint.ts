import { b_, BpxSolidColor, BpxVector2d, spr_, v2d_, v_ } from "../../../src";

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

  const logoScale: BpxVector2d = [2, 2];

  const logoPositionBaseDefault = v2d_(
    (128 - 16 * logoScale[0]) / 2,
    (128 - 16 * logoScale[1]) / 2,
  );
  let logoPositionBase: BpxVector2d = [0, 0];
  let logoPositionOffset: BpxVector2d = [0, 0];

  b_.setOnStarted(() => {
    b_.stopAllSounds();
    b_.playSoundLooped("music_base.wav");
    melodyPlaybackId = b_.playSoundLooped("music_melody.wav", true);

    logoPositionBase = logoPositionBaseDefault;
    logoPositionOffset = [0, 0];
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
      logoPositionBase = v_.add(logoPositionBase, v2d_(velocity, 0));
    }
    if (b_.isPressed("left")) {
      logoPositionBase = v_.add(logoPositionBase, v2d_(-velocity, 0));
    }
    if (b_.isPressed("up")) {
      logoPositionBase = v_.add(logoPositionBase, v2d_(0, -velocity));
    }
    if (b_.isPressed("down")) {
      logoPositionBase = v_.add(logoPositionBase, v2d_(0, velocity));
    }

    logoPositionOffset = v_.mul(
      v2d_(
        Math.cos((b_.frameNumber / 30) * Math.PI),
        Math.sin((b_.frameNumber / 30) * Math.PI),
      ),
      10,
    );

    if (b_.wasJustPressed("menu")) {
      b_.restart();
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(BpxSolidColor.fromRgbCssHex("#754665"));
    b_.sprite(
      spr_("logo.png")(0, 0, 16, 16),
      v_.add(logoPositionBase, logoPositionOffset),
      logoScale,
    );
    if (b_.debug) {
      b_.line(
        [0, 0],
        v_.add(logoPositionBase, logoPositionOffset),
        BpxSolidColor.fromRgbCssHex("#ff0000"),
      );
    }
  });

  startGame();
});
