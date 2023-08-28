import {
  BeetPx,
  FillPattern,
  SolidColor,
  spr_,
  v_,
  Vector2d,
} from "../../../src";

const updateCallsMonitoring = {
  history: Array.from({ length: 120 }, () => 0),
  historyIndex: 0,
};

const logoInnerColor = SolidColor.fromRgbCssHex("#125359");
const logoOuterColor = SolidColor.fromRgbCssHex("#ff6e59");

const velocity = 2;

const logoPositionBaseDefault = v_((128 - 16) / 2, (128 - 16) / 2);
let logoPositionBase = Vector2d.zero;

let numberOfEllipses = 4;

BeetPx.init(
  {
    gameCanvasSize: "128x128",
    visibleTouchButtons: ["left", "right", "up", "down", "x", "o", "menu"],
    debug: {
      available: true,
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
  BeetPx.setOnStarted(() => {
    BeetPx.stopAllSounds();
    BeetPx.playSoundLooped("music_base.wav");
    BeetPx.playSoundLooped("music_melody.wav");

    logoPositionBase = logoPositionBaseDefault;
  });

  BeetPx.setOnUpdate(() => {
    updateCallsMonitoring.history[updateCallsMonitoring.historyIndex] += 1;

    console.group("UPDATE");
    BeetPx.logDebug(`FPS: ${BeetPx.averageRenderFps}`);
    BeetPx.logDebug(` #f: ${BeetPx.frameNumber}`);
    BeetPx.logDebug(`  t: ${BeetPx.t.toFixed(3)}s`);
    BeetPx.logDebug(` dt: ${BeetPx.dt.toFixed(3)}s`);

    if (BeetPx.wasJustPressed("x")) {
      numberOfEllipses = numberOfEllipses * 2;
    }
    if (BeetPx.wasJustPressed("o")) {
      numberOfEllipses = Math.max(1, numberOfEllipses / 2);
    }

    if (BeetPx.isPressed("right")) {
      logoPositionBase = logoPositionBase.add(velocity, 0);
    }
    if (BeetPx.isPressed("left")) {
      logoPositionBase = logoPositionBase.add(-velocity, 0);
    }
    if (BeetPx.isPressed("up")) {
      logoPositionBase = logoPositionBase.add(0, -velocity);
    }
    if (BeetPx.isPressed("down")) {
      logoPositionBase = logoPositionBase.add(0, velocity);
    }

    if (BeetPx.wasJustPressed("menu")) {
      BeetPx.restart();
    }

    console.groupEnd();
  });

  BeetPx.setOnDraw(() => {
    BeetPx.clearCanvas(SolidColor.fromRgbCssHex("#754665"));

    drawThings();

    drawUpdateCallsMonitoring();

    updateCallsMonitoring.historyIndex =
      (updateCallsMonitoring.historyIndex + 1) %
      updateCallsMonitoring.history.length;
    updateCallsMonitoring.history[updateCallsMonitoring.historyIndex] = 0;
  });

  startGame();
});

function drawUpdateCallsMonitoring(): void {
  for (
    let columnIndex = 0;
    columnIndex < updateCallsMonitoring.history.length;
    columnIndex++
  ) {
    for (
      let barIndex = 0;
      barIndex < updateCallsMonitoring.history[columnIndex]!;
      barIndex++
    ) {
      BeetPx.pixel(
        v_(columnIndex + 3, 1 + barIndex * 2),
        columnIndex === updateCallsMonitoring.historyIndex
          ? SolidColor.fromRgbCssHex("#ffffff")
          : SolidColor.fromRgbCssHex("#ff8888"),
      );
    }
  }
}

function drawThings(): void {
  for (let ellipseIndex = 0; ellipseIndex < numberOfEllipses; ellipseIndex++) {
    BeetPx.ellipseFilled(
      v_((ellipseIndex * 128) / numberOfEllipses, 70),
      v_(24, 24),
      SolidColor.fromRgbCssHex(
        `#ab84${((30 * ellipseIndex) % 256).toString(16).padStart(2, "0")}`,
      ),
    );
  }

  BeetPx.setFillPattern(FillPattern.of(0x5a5a));
  BeetPx.rectFilled(
    v_(16, 80),
    v_(96, 32),
    SolidColor.fromRgbCssHex("#012345"),
  );
  BeetPx.setFillPattern(FillPattern.primaryOnly);

  BeetPx.sprite(
    spr_("logo.png")(0, 0, 16, 16),
    logoPositionBase.add(calculateLogoPositionOffset(1.5 * 60)),
  );

  const prevMapping = BeetPx.mapSpriteColors([
    {
      from: logoInnerColor,
      to: logoOuterColor,
    },
    {
      from: logoOuterColor,
      to: logoInnerColor,
    },
  ]);
  BeetPx.sprite(
    spr_("logo.png")(0, 0, 16, 16),
    logoPositionBase.sub(calculateLogoPositionOffset(BeetPx.frameNumber)),
  );
  BeetPx.mapSpriteColors(prevMapping);
}

function calculateLogoPositionOffset(frameNumber: number): Vector2d {
  return v_(
    Math.cos((frameNumber / 60) * Math.PI),
    Math.sin((frameNumber / 60) * Math.PI),
  ).mul(24);
}
