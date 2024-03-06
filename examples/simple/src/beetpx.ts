import { b_, rgb_p8_, spr_, v_, v_0_0_ } from "../../../src";

b_.init({
  assets: ["logo.png", "music_melody.flac"],
}).then(async ({ startGame }) => {
  const logoSprite = spr_("logo.png")(16, 16, 0, 0);
  let circleMovementCenter = v_(64, 64);
  let logoPosition = v_0_0_;

  b_.setOnStarted(() => {
    b_.startPlaybackLooped("music_melody.flac");
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
    b_.clearCanvas(rgb_p8_.storm);
    b_.drawSprite(logoSprite, logoPosition, { centerXy: [true, true] });
  });

  await startGame();
});
