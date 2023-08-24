import { BeetPx, SolidColor, spr_, v_, Vector2d } from "../../../src";

BeetPx.init(
  {
    gameCanvasSize: "128x128",
    // TODO: consider dropping an ability to set FPS other than 60, since we use `BeetPx.dt` now…
    desiredFps: 60,
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
    // TODO: expose a custom logger from BeetPx
    if (BeetPx.debug) {
      console.log(`FPS: ${BeetPx.averageFps}`);
      console.log(`  t: ${BeetPx.t.toFixed(3)}s`);
      console.log(` dt: ${BeetPx.dt.toFixed(3)}s`);
    }

    logoPositionOffset = v_(
      2 * Math.cos(BeetPx.t * Math.PI),
      2 * Math.sin(BeetPx.t * Math.PI),
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
