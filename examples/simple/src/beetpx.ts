import { b_, BpxRgbColor, spr_, v_, v_0_0_ } from "../../../src";

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: 60,
    debugFeatures: !BEETPX__IS_PROD,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.flac" }, { url: "music_melody.flac" }],
    jsons: [],
  },
).then(async ({ startGame }) => {
  let circleMovementCenter = v_(64, 64);
  let logoPosition = v_0_0_;
  let logoSprite = spr_("logo.png")(16, 16, 0, 0);

  b_.setOnStarted(() => {
    b_.startPlaybackLooped("music_melody.flac", {
      muteOnStart: false,
    });
  });

  b_.setOnUpdate(() => {
    circleMovementCenter = circleMovementCenter.add(
      b_.getPressedDirection().mul(3),
    );
    logoPosition = circleMovementCenter.add(
      v_(32).mul(
        Math.cos((b_.frameNumber / 120) * Math.PI),
        Math.sin((b_.frameNumber / 120) * Math.PI),
      ),
    );
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(BpxRgbColor.fromCssHex("#754665"));
    b_.drawSprite(logoSprite, logoPosition, { centerXy: [true, true] });
  });

  await startGame();
});
