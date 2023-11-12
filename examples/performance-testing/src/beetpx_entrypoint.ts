import {
  BpxCanvasSnapshotColorMapping,
  BpxCharSprite,
  BpxFillPattern,
  BpxFont,
  BpxFontId,
  BpxImageUrl,
  BpxRgbColor,
  BpxSpriteColorMapping,
  BpxVector2d,
  b_,
  spr_,
  u_,
  v_,
  v_0_0_,
} from "../../../src";

const fps = 60;

const updateCallsVisualization = {
  history: Array.from({ length: 252 }, () => 0),
  historyIndex: 0,
};

const renderFpsVisualization = {
  history: Array.from({ length: 84 }, () => 0),
  historyIndex: 0,
};

const problematicSprite = spr_("pico-8-font.png")(0, 0, 32, 32);

const logoSprite = spr_("logo.png")(0, 0, 16, 16);
const logoInnerColor = BpxRgbColor.fromCssHex("#125359");
const logoOuterColor = BpxRgbColor.fromCssHex("#ff6e59");

const velocity = 2;

const logoPositionBaseDefault = v_((128 - 16) / 2, (128 - 16) / 2).sub(0, 8);
let logoPositionBase = v_0_0_;

let numberOfEllipses = 4;
let numberOfBigSprites = 4;

const negative = new BpxCanvasSnapshotColorMapping((c) =>
  c instanceof BpxRgbColor
    ? new BpxRgbColor(0xff - c.r, 0xff - c.g, 0xff - c.b)
    : null,
);

class Font1 implements BpxFont {
  readonly id: BpxFontId = "f1";
  readonly imageUrl: BpxImageUrl = "logo.png";

  spritesFor(text: string): BpxCharSprite[] {
    return [
      {
        positionInText: v_0_0_,
        char: "a",
        sprite: spr_("logo.png")(0, 0, 12, 8),
      },
    ];
  }
}

class Font2 implements BpxFont {
  readonly id: BpxFontId = "f2";
  readonly imageUrl: BpxImageUrl = "logo.png";

  spritesFor(text: string): BpxCharSprite[] {
    return [
      {
        positionInText: v_0_0_,
        char: "a",
        sprite: spr_("logo.png")(14, 0, 2, 16),
      },
    ];
  }
}

b_.init(
  {
    gameCanvasSize: "256x256",
    desiredUpdateFps: fps,
    debugFeatures: !BEETPX__IS_PROD,
  },
  {
    images: [{ url: "logo.png" }, { url: "pico-8-font.png" }],
    fonts: [
      {
        font: new Font1(),
        imageBgColor: logoOuterColor,
        imageTextColor: logoInnerColor,
      },
      {
        font: new Font2(),
        imageBgColor: logoInnerColor,
        imageTextColor: logoOuterColor,
      },
    ],
    sounds: [{ url: "music_base.wav" }, { url: "music_melody.wav" }],
    jsons: [],
  },
).then(({ startGame }) => {
  b_.setOnStarted(() => {
    b_.playSoundLooped("music_base.wav");
    b_.playSoundLooped("music_melody.wav");

    logoPositionBase = logoPositionBaseDefault;
  });

  b_.setOnUpdate(() => {
    updateCallsVisualization.history[
      updateCallsVisualization.historyIndex
    ] += 1;

    console.group("UPDATE");
    b_.logDebug(`frame: ${b_.frameNumber}`);
    b_.logDebug(`FPS: ${b_.renderFps}`);

    if (b_.wasJustPressed("a")) {
      numberOfEllipses = numberOfEllipses * 2;
    }
    if (b_.wasJustPressed("b")) {
      numberOfEllipses = Math.max(1, numberOfEllipses / 2);
    }

    if (b_.wasJustPressed("up")) {
      numberOfBigSprites = numberOfBigSprites * 2;
    }
    if (b_.wasJustReleased("down")) {
      numberOfBigSprites = Math.max(1, numberOfBigSprites / 2);
    }

    if (b_.isPressed("right")) {
      logoPositionBase = logoPositionBase.add(velocity, 0);
    }
    if (b_.isPressed("left")) {
      logoPositionBase = logoPositionBase.add(-velocity, 0);
    }

    if (b_.wasJustPressed("menu")) {
      b_.restart();
    }

    b_.logDebug("numberOfBigSprites =", numberOfBigSprites);
    b_.logDebug("numberOfEllipses =", numberOfEllipses);
    console.groupEnd();
  });

  b_.setOnDraw(() => {
    b_.setClippingRegion(v_(1, 1), v_(254, 254));

    renderFpsVisualization.history[renderFpsVisualization.historyIndex] =
      b_.renderFps;

    b_.clearCanvas(BpxRgbColor.fromCssHex("#754665"));

    drawEllipses();

    b_.takeCanvasSnapshot();
    b_.rectFilled(v_(5, 65), v_(50, 10), negative);
    b_.rectFilled(v_(35, 70), v_(50, 10), negative);
    b_.takeCanvasSnapshot();

    b_.setFont("f1");
    const s1 = u_.measureText("111");
    b_.print("111", v_(1, 8), BpxRgbColor.fromCssHex("#ff00ff"));
    b_.print("111", v_(1 + s1.x + 1, 8), BpxRgbColor.fromCssHex("#ff00ff"));
    b_.print("111", v_(1, 8 + s1.y + 1), BpxRgbColor.fromCssHex("#ff00ff"));
    b_.setFont("f2");
    const s2 = u_.measureText("222");
    b_.print(
      "222",
      v_(1 + s1.x + 1 + s1.x + 1, 8),
      BpxRgbColor.fromCssHex("#ff00ff"),
    );
    b_.print(
      "222",
      v_(1 + s1.x + 1 + s1.x + 1 + s2.x + 1, 8),
      BpxRgbColor.fromCssHex("#ff00ff"),
    );
    b_.print(
      "222",
      v_(1 + s1.x + 1 + s1.x + 1, 8 + s2.y + 1),
      BpxRgbColor.fromCssHex("#ff00ff"),
    );

    b_.rectFilled(v_(5, 5), v_(50, 10), BpxRgbColor.fromCssHex("#ffff00"));
    drawSprites();
    b_.rectFilled(v_(35, 10), v_(50, 10), BpxRgbColor.fromCssHex("#00ffff"));

    b_.rectFilled(v_(65, 75), v_(50, 10), negative);

    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        b_.sprite(spr_("logo.png")(4, 4, 8, 8), v_(4 + row * 16, 4 + col * 16));
      }
    }

    b_.sprite(problematicSprite, v_(200, 200));

    b_.removeClippingRegion();

    drawUpdateCallsVisualization();

    drawRenderFpsVisualization();

    updateCallsVisualization.historyIndex++;
    updateCallsVisualization.historyIndex %=
      updateCallsVisualization.history.length;
    updateCallsVisualization.history[updateCallsVisualization.historyIndex] = 0;

    renderFpsVisualization.historyIndex++;
    renderFpsVisualization.historyIndex %=
      renderFpsVisualization.history.length;
  });

  startGame();
});

function drawUpdateCallsVisualization(): void {
  for (
    let columnIndex = 0;
    columnIndex < updateCallsVisualization.history.length;
    columnIndex++
  ) {
    for (
      let barIndex = 0;
      barIndex < updateCallsVisualization.history[columnIndex]!;
      barIndex++
    ) {
      b_.pixel(
        v_(columnIndex + 3, 1 + barIndex * 2),
        columnIndex === updateCallsVisualization.historyIndex
          ? BpxRgbColor.fromCssHex("#ffffff")
          : BpxRgbColor.fromCssHex("#ff8888"),
      );
    }
  }
}

function drawRenderFpsVisualization(): void {
  for (
    let columnIndex = 0;
    columnIndex < renderFpsVisualization.history.length;
    columnIndex++
  ) {
    const bars = Math.round(renderFpsVisualization.history[columnIndex]! / 10);
    for (let barIndex = 0; barIndex < bars; barIndex++) {
      b_.rectFilled(
        v_(columnIndex * 3 + 2, 252 - barIndex * 3),
        v_(2, 2),
        columnIndex === renderFpsVisualization.historyIndex
          ? BpxRgbColor.fromCssHex("#ffffff")
          : barIndex % 3 === 2
          ? BpxRgbColor.fromCssHex("#ff4444")
          : BpxRgbColor.fromCssHex("#ff8888"),
      );
    }
  }
}

function drawEllipses(): void {
  b_.setFillPattern(BpxFillPattern.of(0x5b59));
  for (let ellipseIndex = 0; ellipseIndex < numberOfEllipses; ellipseIndex++) {
    const rComponent = ((30 * ellipseIndex) % 256)
      .toString(16)
      .padStart(2, "0");
    const bComponent = ((30 * ellipseIndex) % 256)
      .toString(16)
      .padStart(2, "0");
    b_.ellipseFilled(
      v_((ellipseIndex * 128) / numberOfEllipses, 60),
      v_(24, 24),
      BpxRgbColor.fromCssHex(`#${rComponent}84${bComponent}`),
    );
  }
  b_.setFillPattern(BpxFillPattern.primaryOnly);
}

function drawSprites(): void {
  b_.pixels(v_(1, -2), BpxRgbColor.fromCssHex("#00ffff"), [
    "####",
    "####",
    "####",
    "################################",
    "####",
    "####",
    "_##_",
  ]);
  b_.line(
    v_0_0_,
    logoPositionBase.add(calculateLogoPositionOffset(1.5 * fps)),
    BpxRgbColor.fromCssHex("#ff4444"),
  );

  b_.sprite(
    logoSprite,
    logoPositionBase.add(calculateLogoPositionOffset(1.5 * fps)),
  );

  const prevMapping = b_.setSpriteColorMapping(
    BpxSpriteColorMapping.from([
      [logoInnerColor, logoOuterColor],
      [logoOuterColor, logoInnerColor],
    ]),
  );
  for (let i = 0; i < numberOfBigSprites; i++) {
    b_.sprite(
      logoSprite,
      logoPositionBase.sub(calculateLogoPositionOffset(b_.frameNumber + i)),
      v_(2, 3),
    );
  }
  b_.setSpriteColorMapping(prevMapping);
}

function calculateLogoPositionOffset(frameNumber: number): BpxVector2d {
  return v_(
    Math.cos((frameNumber / fps) * Math.PI),
    Math.sin((frameNumber / fps) * Math.PI),
  ).mul(24);
}
