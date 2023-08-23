import { BeetPx, SolidColor, spr_, v_, Vector2d } from "../../../src";

BeetPx.init(
  {
    gameCanvasSize: "128x128",
    desiredFps: 30,
    visibleTouchButtons: ["left", "right", "up", "down", "x", "o", "menu"],
    logActualFps: true,
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
    sounds: [],
  },
).then(({ startGame }) => {
  console.log("BeetPx initialized");

  let logoPositionBase = Vector2d.zero;
  let logoPositionOffset = Vector2d.zero;

  BeetPx.setOnStarted(() => {
    logoPositionBase = v_((128 - 16) / 2, (128 - 16) / 2);
    logoPositionOffset = Vector2d.zero;
  });

  BeetPx.setOnUpdate(() => {
    console.log(`FPS: ${BeetPx.averageFps}`);

    logoPositionOffset = v_(
      Math.cos(BeetPx.frameNumber / 12),
      Math.sin(BeetPx.frameNumber / 12),
    ).mul(8);
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
