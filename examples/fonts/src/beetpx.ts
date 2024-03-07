import {
  b_,
  BpxFont,
  BpxVector2d,
  font_pico8_,
  font_saint11Minimal4_,
  font_saint11Minimal5_,
  rgb_p8_,
  u_,
  v_,
  v_0_0_,
} from "../../../src";
import { customFont } from "./CustomFont";
import { pico8FontWithAdjustments } from "./Pico8FontWithAdjustments";

// TODO: take care of all TODOs
// TODO: update tests, write new ones
const text = [
  "The quick [c1]brown[c0] fox jumps",
  "over the [c2]lazy[c0] dog",
  "0123456789 -+= .,:;!? ~@#$%^&*_ ()[]{}<> /|\\ `'\"",
].join("\n");

b_.init({
  gameCanvasSize: "256x256",
  assets: [...customFont.spriteSheetUrls],
}).then(async ({ startGame }) => {
  const minZoom = 1;
  const maxZoom = 8;
  let zoom = minZoom;

  let cameraXy = v_0_0_;

  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a")) {
      const newZoom = u_.clamp(minZoom, zoom * 2, maxZoom);
      cameraXy = cameraXy.mul(newZoom / zoom);
      zoom = newZoom;
    }
    if (b_.wasButtonJustPressed("b")) {
      const newZoom = u_.clamp(minZoom, zoom / 2, maxZoom);
      cameraXy = cameraXy.mul(newZoom / zoom);
      zoom = newZoom;
    }
    cameraXy = cameraXy.sub(b_.getPressedDirection().mul(2).mul(zoom));
  });

  b_.setOnDraw(() => {
    b_.setCameraXy(cameraXy);

    b_.clearCanvas(rgb_p8_.wine);

    let cursor = v_(8, 8).mul(zoom);

    for (const font of [
      font_pico8_,
      pico8FontWithAdjustments,
      font_saint11Minimal4_,
      font_saint11Minimal5_,
      customFont,
    ]) {
      b_.useFont(font);
      const textWh = b_.measureText(text, { scaleXy: v_(zoom) });
      drawBox(textWh, cursor, zoom);
      b_.drawText(cursor, rgb_p8_.peach, text, {
        scaleXy: v_(zoom),
        centerXy: [true, true],
        colorMarkers: {
          c0: rgb_p8_.peach,
          c1: rgb_p8_.tan,
          c2: rgb_p8_.sky,
        },
      });

      drawMarkers(font, cursor, zoom);

      cursor = cursor.add(0, textWh.y).add(v_(0, 4).mul(zoom));
    }
  });
  await startGame();
});

function drawBox(textWh: BpxVector2d, cursor: BpxVector2d, zoom: number): void {
  //
  // a border
  //
  b_.drawRectFilled(
    cursor.sub(v_(zoom)),
    textWh.add(v_(2).mul(zoom)),
    rgb_p8_.dusk,
  );

  //
  // a background
  //
  b_.drawRectFilled(cursor, textWh, rgb_p8_.storm);
}

function drawMarkers(font: BpxFont, cursor: BpxVector2d, zoom: number): void {
  //
  // the highest pixel of the ascent
  //
  b_.drawRectFilled(cursor.add(v_(-3, 0).mul(zoom)), v_(zoom), rgb_p8_.pink);

  //
  // the ascent
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, 0).mul(zoom)),
    v_(1, font.ascent).mul(zoom),
    rgb_p8_.pink,
  );

  //
  // the lowest pixel of the ascent
  //
  b_.drawRectFilled(
    cursor.add(v_(-3, font.ascent - 1).mul(zoom)),
    v_(zoom),
    rgb_p8_.pink,
  );

  //
  // the descent
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, font.ascent).mul(zoom)),
    v_(1, font.descent).mul(zoom),
    rgb_p8_.pink,
  );

  //
  // the lowest pixel of the descent
  //
  b_.drawRectFilled(
    cursor.add(v_(-3, font.ascent + font.descent - 1).mul(zoom)),
    v_(zoom),
    rgb_p8_.pink,
  );

  //
  // the line gap
  //
  b_.drawRectFilled(
    cursor.add(v_(-4, font.ascent + font.descent).mul(zoom)),
    v_(1, font.lineGap).mul(zoom),
    rgb_p8_.pink,
  );
}
