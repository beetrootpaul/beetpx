import {
  b_,
  BpxFontSaint11Minimal4,
  BpxRgbColor,
  spr_,
  u_,
  v_,
  v_0_0_,
  v_1_1_,
} from "../../../src";

b_.init(
  {
    gameCanvasSize: "64x64",
    desiredUpdateFps: 30,
    debugFeatures: !BEETPX__IS_PROD,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.flac" }, { url: "music_melody.flac" }],
    jsons: [],
  },
).then(async ({ startGame }) => {
  let melodyPlaybackId: number = -1;

  const velocity = 2;

  const logoPositionBaseDefault = v_((64 - 16) / 2, (64 - 16) / 2);
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

    b_.setFont(BpxFontSaint11Minimal4.id);
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
    );

    const textLines = [
      `.:!? '" */+-`,
      "01234 56789",
      "%$()[]{}<>",
      "ABCDE FGHIJ KLM",
      "NOPQR STUVW XYZ",
      `abcde fghij klm`,
      `nopqr stuvw xyz`,
    ];
    const textXy = v_(1, 64 - 5 * textLines.length);
    let textWh = v_0_0_;
    let textRealXy = textXy;
    textLines.forEach((text, i) => {
      const [xyOffset, wh] = u_.measureText(text);
      if (i === 0) {
        textRealXy = textXy.add(xyOffset);
      }
      textWh = v_(Math.max(textWh.x, wh.x), textWh.y + (i > 0 ? 1 : 0) + wh.y);
    });
    b_.rect(
      textRealXy.sub(v_1_1_),
      textWh.add(2),
      BpxRgbColor.fromCssHex("#83769c"),
    );
    textLines.forEach((text, i) => {
      b_.print(text, textXy.add(0, 5 * i), BpxRgbColor.fromCssHex("#c2c3c7"));
    });

    if (b_.debug) {
      b_.line(
        v_(0, 0),
        logoPositionBase.add(logoPositionOffset),
        BpxRgbColor.fromCssHex("#ff0000"),
      );
    }
  });

  await startGame();
});
