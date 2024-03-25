import { b_, rgb_p8_, spr_, v_, v_0_0_ } from "../../../src";

declare global {
  interface Window {
    PREV_COMMIT: string;
  }
}

const logoSprite = spr_("logo.png")(16, 16, 0, 0);
let circleMovementCenter = v_(64, 64);
let logoPosition = v_0_0_;

b_.init({
  config: {
    assets: ["logo.png", "music_melody.flac"],
    debugMode: {
      available: true,
      forceEnabledOnStart: true,
      fpsDisplay: { enabled: true },
    },
    frameByFrame: {
      available: true,
    },
  },
  onStarted() {
    b_.startPlaybackLooped("music_melody.flac");
  },
  onUpdate() {
    circleMovementCenter = circleMovementCenter.add(
      b_.getPressedDirection().mul(3),
    );
    logoPosition = circleMovementCenter.add(
      v_(32).mul(
        Math.cos((b_.frameNumber / 120) * Math.PI),
        Math.sin((b_.frameNumber / 120) * Math.PI),
      ),
    );
  },
  onDraw() {
    b_.clearCanvas(rgb_p8_.storm);
    b_.drawSprite(logoSprite, logoPosition, { centerXy: [true, true] });
    b_.drawText(`PREV_COMMIT=${window.PREV_COMMIT}`, v_(1, 122), rgb_p8_.dusk);
  },
});