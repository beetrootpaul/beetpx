import { BeetPx, BpxSolidColor, BpxVector2d, spr_, v_ } from "../../../src";

BeetPx.init(
  {
    gameCanvasSize: v_(128, 128),
    desiredFps: 30,
    logActualFps: true,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [],
  },
).then(({ startGame }) => {
  console.log("BeetPx initialized");

  const logoPositionBase = v_((128 - 16) / 2, (128 - 16) / 2);
  let logoPositionOffset = BpxVector2d.zero;

  BeetPx.setOnUpdate(() => {
    console.log(`FPS: ${BeetPx.averageFps}`);

    logoPositionOffset = v_(
      Math.cos(BeetPx.frameNumber / 12),
      Math.sin(BeetPx.frameNumber / 12),
    ).mul(8);
  });

  BeetPx.setOnDraw(() => {
    BeetPx.clearCanvas(BpxSolidColor.fromRgbCssHex("#754665"));
    BeetPx.sprite(
      "logo.png",
      spr_(0, 0, 16, 16),
      logoPositionBase.add(logoPositionOffset),
    );
  });

  startGame(() => {
    console.log("Game started");
  });
});
