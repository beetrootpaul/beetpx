import {
  b_,
  BpxVector2d,
  font_pico8_,
  font_saint11Minimal4_,
  font_saint11Minimal5_,
  rgb_p8_,
  v_,
  v_0_0_,
} from "../../../src";
import { BpxFont } from "../../../src/font/Font";
import { customFont } from "./CustomFont";
import { pico8FontWithAdjustments } from "./Pico8FontWithAdjustments";

const text = [
  "The quick [c1]brown[c0] fox jumps",
  "over the [c2]lazy[c0] dog",
  "0123456789 -+= .,:;!? ~@#$%^&*_",
  "()[]{}<> /|\\ `'\"",
  "⭐➡❎❤️",
].join("\n");

const minScaleXy = v_(1);
const maxScaleXy = v_(8);
let scaleXy = minScaleXy;

let cameraXy = v_0_0_;

b_.init({
  canvasSize: "256x256",
  assets: [...customFont.spriteSheetUrls],
  debugMode: {
    available: true,
    fpsDisplay: { enabled: true },
  },
}).then(async ({ startGame }) => {
  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a")) {
      const newScale = scaleXy.mul(2).clamp(minScaleXy, maxScaleXy);
      cameraXy = cameraXy.mul(newScale.div(scaleXy));
      scaleXy = newScale;
    }
    if (b_.wasButtonJustPressed("b")) {
      const newScale = scaleXy.div(2).clamp(minScaleXy, maxScaleXy);
      cameraXy = cameraXy.mul(newScale.div(scaleXy));
      scaleXy = newScale;
    }
    if (b_.wasButtonJustPressed("menu")) {
      cameraXy = v_0_0_;
      scaleXy = minScaleXy;
    }
    cameraXy = cameraXy.sub(b_.getPressedDirection().mul(2).mul(scaleXy));
  });

  b_.setOnDraw(() => {
    b_.setCameraXy(cameraXy);

    b_.clearCanvas(rgb_p8_.wine);

    let cursor = v_(8, 4).mul(scaleXy);

    for (const [font, label] of [
      [font_pico8_, "font_pico8_"],
      [pico8FontWithAdjustments, "pico8FontWithAdjustments"],
      [font_saint11Minimal4_, "font_saint11Minimal4_"],
      [font_saint11Minimal5_, "font_saint11Minimal5_"],
      [customFont, "customFont"],
    ] as const) {
      b_.useFont(font_pico8_);
      b_.drawText(label, cursor, rgb_p8_.dusk, { scaleXy });
      cursor = cursor.add(scaleXy.mul(0, 8));

      b_.useFont(font);
      const { wh: textWh, offset: textOffset } = b_.measureText(text, {
        scaleXy,
      });
      drawBox(textWh, cursor.add(textOffset), scaleXy);
      b_.drawText(text, cursor, rgb_p8_.peach, {
        scaleXy,
        colorMarkers: {
          c0: rgb_p8_.peach,
          c1: rgb_p8_.tan,
          c2: rgb_p8_.sky,
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
  b_.drawRectFilled(
    cursor.sub(scaleXy),
    textWh.add(v_(2).mul(scaleXy)),
    rgb_p8_.dusk,
  );

  //
  // a background
  //
  b_.drawRectFilled(cursor, textWh, rgb_p8_.storm);
}

function drawMarkers(
  font: BpxFont,
  cursor: BpxVector2d,
  scaleXy: BpxVector2d,
): void {
  //
  // the highest pixel of the ascent
  //
  b_.drawRectFilled(cursor.add(v_(-3, 0).mul(scaleXy)), scaleXy, rgb_p8_.pink);

  //
  // the ascent
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, 0).mul(scaleXy)),
    v_(1, font.ascent).mul(scaleXy),
    rgb_p8_.pink,
  );

  //
  // the lowest pixel of the ascent
  //
  b_.drawRectFilled(
    cursor.add(v_(-3, font.ascent - 1).mul(scaleXy)),
    scaleXy,
    rgb_p8_.pink,
  );

  //
  // the descent
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, font.ascent).mul(scaleXy)),
    v_(1, font.descent).mul(scaleXy),
    rgb_p8_.pink,
  );

  //
  // the lowest pixel of the descent
  //
  b_.drawRectFilled(
    cursor.add(v_(-3, font.ascent + font.descent - 1).mul(scaleXy)),
    scaleXy,
    rgb_p8_.pink,
  );

  //
  // the line gap
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, font.ascent + font.descent).mul(scaleXy)),
    v_(1, font.lineGap).mul(scaleXy),
    rgb_p8_.pink,
  );
}
