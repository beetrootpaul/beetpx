import {
  $,
  $d,
  $font_pico8,
  $font_saint11Minimal4,
  $font_saint11Minimal5,
  $rgb_p8,
  $v,
  $v_0_0,
  BpxFont,
  BpxVector2d,
} from "../../../src";
import { customFont } from "./CustomFont";
import { pico8FontWithAdjustments } from "./Pico8FontWithAdjustments";

// Lines below are arranged in a way which allows to visually see how
// treated are lines effectively blank, because all of they characters
// have no corresponding glyphs in a given font.
const text = [
  "The quick [brown]brown[_] fox jumps",
  "over the [🟦]lazy[_] dog",
  "0123456789 -+= .,:;!? ~@#$%^&*_",
  "⭐❤️⬅➡⬆⬇⭕❎♪⏏️",
  "()[]{}<> /|\\ `'\"",
].join("\n");

const minScaleXy = $v(1);
const maxScaleXy = $v(8);
let scaleXy = minScaleXy;

let cameraXy = $v_0_0;

$.init({
  canvasSize: "256x256",
  assets: [...customFont.spriteSheetUrls],
  debugMode: {
    available: true,
    fpsDisplay: { enabled: true },
  },
}).then(async ({ startGame }) => {
  $.setOnUpdate(() => {
    if ($.wasButtonJustPressed("a")) {
      const newScale = scaleXy.mul(2).clamp(minScaleXy, maxScaleXy);
      cameraXy = cameraXy.mul(newScale.div(scaleXy));
      scaleXy = newScale;
    }
    if ($.wasButtonJustPressed("b")) {
      const newScale = scaleXy.div(2).clamp(minScaleXy, maxScaleXy);
      cameraXy = cameraXy.mul(newScale.div(scaleXy));
      scaleXy = newScale;
    }
    if ($.wasButtonJustPressed("menu")) {
      cameraXy = $v_0_0;
      scaleXy = minScaleXy;
    }
    cameraXy = cameraXy.sub($.getPressedDirection().mul(2).mul(scaleXy));
  });

  $.setOnDraw(() => {
    $d.setCameraXy(cameraXy);

    $d.clearCanvas($rgb_p8.wine);

    let cursor = $v(8, 4).mul(scaleXy);

    for (const [font, label] of [
      [$font_pico8, "$font_pico8"],
      [pico8FontWithAdjustments, "pico8FontWithAdjustments"],
      [$font_saint11Minimal4, "$font_saint11Minimal4"],
      [$font_saint11Minimal5, "$font_saint11Minimal5"],
      [customFont, "customFont"],
    ] as const) {
      $.useFont($font_pico8);
      $d.text(label, cursor, $rgb_p8.dusk, { scaleXy });
      cursor = cursor.add(scaleXy.mul(0, 8));

      $.useFont(font);
      const { wh: textWh, offset: textOffset } = $.measureText(text, {
        scaleXy,
      });
      drawBox(textWh, cursor.add(textOffset), scaleXy);
      $d.text(text, cursor, $rgb_p8.peach, {
        scaleXy,
        colorMarkers: {
          _: $rgb_p8.peach,
          brown: $rgb_p8.tan,
          "🟦": $rgb_p8.sky,
        },
      });
      drawMarkers(font, cursor.add(textOffset), scaleXy);
      cursor = cursor.add(0, textWh.y).add(scaleXy.mul(0, 4));
    }
  });

  await startGame();
});

function drawBox(
  textWh: BpxVector2d,
  cursor: BpxVector2d,
  scaleXy: BpxVector2d,
): void {
  //
  // a border
  //
  $d.rectFilled(
    cursor.sub(scaleXy),
    textWh.add($v(2).mul(scaleXy)),
    $rgb_p8.dusk,
  );

  //
  // a background
  //
  $d.rectFilled(cursor, textWh, $rgb_p8.storm);
}

function drawMarkers(
  font: BpxFont,
  cursor: BpxVector2d,
  scaleXy: BpxVector2d,
): void {
  //
  // the highest pixel of the ascent
  //
  $d.rectFilled(cursor.add($v(-3, 0).mul(scaleXy)), scaleXy, $rgb_p8.pink);

  //
  // the ascent
  //
  $d.rectFilled(
    cursor.add($v(-4, 0).mul(scaleXy)),
    $v(1, font.ascent).mul(scaleXy),
    $rgb_p8.pink,
  );

  //
  // the lowest pixel of the ascent
  //
  $d.rectFilled(
    cursor.add($v(-3, font.ascent - 1).mul(scaleXy)),
    scaleXy,
    $rgb_p8.pink,
  );

  //
  // the descent
  //
  $d.rectFilled(
    cursor.add($v(-4, font.ascent).mul(scaleXy)),
    $v(1, font.descent).mul(scaleXy),
    $rgb_p8.pink,
  );

  //
  // the lowest pixel of the descent
  //
  $d.rectFilled(
    cursor.add($v(-3, font.ascent + font.descent - 1).mul(scaleXy)),
    scaleXy,
    $rgb_p8.pink,
  );

  //
  // the line gap
  //
  $d.rectFilled(
    cursor.add($v(-4, font.ascent + font.descent).mul(scaleXy)),
    $v(1, font.lineGap).mul(scaleXy),
    $rgb_p8.pink,
  );
}
