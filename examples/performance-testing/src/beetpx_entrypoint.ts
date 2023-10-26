import {
  b_,
  BpxFillPattern,
  BpxSolidColor,
  BpxVector2d,
  spr_,
  u_,
  v_,
  v_0_0_,
} from "../../../src";

const fps = 60;

const updateCallsVisualization = {
  history: Array.from({ length: 120 }, () => 0),
  historyIndex: 0,
};

const renderFpsVisualization = {
  history: Array.from({ length: 40 }, () => 0),
  historyIndex: 0,
};

const logoSprite = spr_("logo.png")(0, 0, 16, 16);
const logoInnerColor = BpxSolidColor.fromRgbCssHex("#125359");
const logoOuterColor = BpxSolidColor.fromRgbCssHex("#ff6e59");

const velocity = 2;

const logoPositionBaseDefault = v_((128 - 16) / 2, (128 - 16) / 2).sub(0, 16);
let logoPositionBase = v_0_0_;

let numberOfEllipses = 4;
let numberOfBigSprites = 1;

b_.init(
  {
    gameCanvasSize: "128x128",
    desiredUpdateFps: fps,
    visibleTouchButtons: ["left", "right", "up", "down", "a", "b", "menu"],
    debugFeatures: !__BEETPX_IS_PROD__,
  },
  {
    images: [{ url: "logo.png" }],
    fonts: [],
    sounds: [{ url: "music_base.wav" }, { url: "music_melody.wav" }],
    jsons: [],
  },
).then(({ startGame }) => {
  b_.setOnStarted(() => {
    // TODO: this call is probably no longer needed, since handled by BeetPx internally
    b_.stopAllPlaybacks();
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

    // TODO: rework these buttons for Xbox controller
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

    // TODO: wrong button on Xbox controller :/
    if (b_.wasJustPressed("menu")) {
      b_.restart();
    }

    b_.logDebug("numberOfBigSprites =", numberOfBigSprites);
    b_.logDebug("numberOfEllipses =", numberOfEllipses);
    console.groupEnd();
  });

  b_.setOnDraw(() => {
    renderFpsVisualization.history[renderFpsVisualization.historyIndex] =
      b_.renderFps;

    b_.clearCanvas(BpxSolidColor.fromRgbCssHex("#754665"));

    drawNShapes();

    drawSprites();

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
          ? BpxSolidColor.fromRgbCssHex("#ffffff")
          : BpxSolidColor.fromRgbCssHex("#ff8888"),
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
        v_(columnIndex * 3 + 2, 125 - barIndex * 3),
        v_(2, 2),
        columnIndex === renderFpsVisualization.historyIndex
          ? BpxSolidColor.fromRgbCssHex("#ffffff")
          : barIndex % 3 === 2
          ? BpxSolidColor.fromRgbCssHex("#ff4444")
          : BpxSolidColor.fromRgbCssHex("#ff8888"),
      );
    }
  }
}

function drawNShapes(): void {
  b_.setFillPattern(BpxFillPattern.of(0x5b59));
  for (let ellipseIndex = 0; ellipseIndex < numberOfEllipses; ellipseIndex++) {
    const rComponent = ((30 * ellipseIndex) % 256)
      .toString(16)
      .padStart(2, "0");
    const bComponent = ((30 * ellipseIndex) % 256)
      .toString(16)
      .padStart(2, "0");
    b_.ellipseFilled(
      v_((ellipseIndex * 128) / numberOfEllipses, 70),
      v_(24, 24),
      BpxSolidColor.fromRgbCssHex(`#${rComponent}84${bComponent}`),
    );
  }
  b_.setFillPattern(BpxFillPattern.primaryOnly);
}

function drawSprites(): void {
  b_.sprite(
    logoSprite,
    logoPositionBase.add(calculateLogoPositionOffset(1.5 * fps)),
  );

  const prevMapping = b_.mapSpriteColors([
    {
      from: logoInnerColor,
      to: logoOuterColor,
    },
    {
      from: logoOuterColor,
      to: logoInnerColor,
    },
  ]);
  u_.range(numberOfBigSprites).forEach((_, i) => {
    b_.sprite(
      logoSprite,
      logoPositionBase.sub(calculateLogoPositionOffset(b_.frameNumber + i)),
      v_(2, 2),
    );
  });
  b_.mapSpriteColors(prevMapping);
}

function calculateLogoPositionOffset(frameNumber: number): BpxVector2d {
  return v_(
    Math.cos((frameNumber / fps) * Math.PI),
    Math.sin((frameNumber / fps) * Math.PI),
  ).mul(24);
}
