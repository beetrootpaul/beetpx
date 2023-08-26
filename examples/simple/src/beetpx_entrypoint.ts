import { BeetPx, SolidColor, spr_, v_, Vector2d } from "../../../src";

BeetPx.init(
  {
    gameCanvasSize: "128x128",
    visibleTouchButtons: ["left", "right", "up", "down", "x", "o", "menu"],
    debug: {
      available: !__BEETPX_IS_PROD__,
      toggleKey: ";",
      frameByFrame: {
        activateKey: ",",
        stepKey: ".",
      },
    },
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.wav" }, { url: "music_melody.wav" }],
  },
).then(({ startGame }) => {
  let melodyPlaybackId: number = -1;

  const velocity = 64;

  const logoPositionBaseDefault = v_((128 - 16) / 2, (128 - 16) / 2);
  let logoPositionBase = Vector2d.zero;
  let logoPositionOffset = Vector2d.zero;

  BeetPx.setOnStarted(() => {
    BeetPx.stopAllSounds();
    BeetPx.playSoundLooped("music_base.wav");
    melodyPlaybackId = BeetPx.playSoundLooped("music_melody.wav", true);

    logoPositionBase = logoPositionBaseDefault;
    logoPositionOffset = Vector2d.zero;
  });

  BeetPx.setOnUpdate(() => {
    BeetPx.logDebug(`FPS: ${BeetPx.averageFps}`);
    BeetPx.logDebug(`  t: ${BeetPx.t.toFixed(3)}s`);
    BeetPx.logDebug(` dt: ${BeetPx.dt.toFixed(3)}s`);

    if (BeetPx.wasJustPressed("x")) {
      BeetPx.unmuteSound(melodyPlaybackId);
    }
    if (BeetPx.wasJustPressed("o")) {
      BeetPx.muteSound(melodyPlaybackId);
    }

    // TODO: consider exposing some XY (-1,1) representation of directions
    if (BeetPx.isPressed("right")) {
      logoPositionBase = logoPositionBase.add(velocity * BeetPx.dt, 0);
    }
    if (BeetPx.isPressed("left")) {
      logoPositionBase = logoPositionBase.add(-velocity * BeetPx.dt, 0);
    }
    if (BeetPx.isPressed("up")) {
      logoPositionBase = logoPositionBase.add(0, -velocity * BeetPx.dt);
    }
    if (BeetPx.isPressed("down")) {
      logoPositionBase = logoPositionBase.add(0, velocity * BeetPx.dt);
    }

    logoPositionOffset = v_(
      Math.cos(BeetPx.t * Math.PI),
      Math.sin(BeetPx.t * Math.PI),
    ).mul(10);

    if (BeetPx.wasJustPressed("menu")) {
      BeetPx.restart();
    }
  });

  BeetPx.setOnDraw(() => {
    BeetPx.clearCanvas(SolidColor.fromRgbCssHex("#754665"));
    BeetPx.sprite(
      spr_("logo.png")(0, 0, 16, 16),
      logoPositionBase.add(logoPositionOffset),
    );
    if (BeetPx.debug) {
      BeetPx.line(
        v_(0, 0),
        logoPositionBase.add(logoPositionOffset),
        SolidColor.fromRgbCssHex("#ff0000"),
      );
    }
  });

  startGame();
});

// TODO: this example, on itch, runs significantly faster when open on a mobile :thinking:
