import {
  b_,
  BpxFontSaint11Minimal4,
  BpxFontSaint11Minimal5,
  rgb_p8_,
  u_,
  v_,
} from "../../../src";
import { BpxFontPico8 } from "../../../src/font/BpxFontPico8";
import { CustomFont } from "./CustomFont";
import { CustomFontExternalImage } from "./CustomFontExternalImage";
import { Pico8WithAdjustments } from "./Pico8WithAdjustments";

// TODO: take care of all TODOs
// TODO: update tests, write new ones
// TODO: remove fonts from assets to load, keep only images there. Then, simplify font loading to not fail if pixels font and no image fetcehd yet
// TODO: better font characteristic
// TODO: font fg color to replace or bg color to remove? Or some function to blend fonts with antialiasing in them?
// TODO: tests for the markup edge cases like nesting, unclosing, escaping what is supposed to not be a markup, unrecognized markup, turning markup on and off
// TODO: utils helper to inject "\n" in order to make text fit within

// TODO: "\n" support + ability to change line height?
// TODO: consider allowing to make
// TODO: markup for changing a color of a word (then, remove color by the char) + turning it on/off depending on whether markup definition is passed or not
// TODO: a way to print a markup without interpreting it as a markup ("[[c1]"?]
const text =
  "The quick [c1]brown[c0] fox jumps\nover the [c2]lazy[c0] dog\n0123456789 -+= .,:;!?\n@#$%^&* ()[]{}<> \\|/'\"";

b_.init({
  gameCanvasSize: "256x256",
  assets: {
    images: [
      // TODO: make it NOT require a new instance just to grab the image URL
      { url: new CustomFont().imageUrl },
      { url: new CustomFontExternalImage().imageUrl },
    ],
  },
}).then(async ({ startGame }) => {
  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.wine);

    let cursor = v_(8, 2);

    // TODO: implement and demonstrate line breaking within a given width
    for (const font of [
      // TODO: do not require a construction?
      // TODO: add missing chars to PICO-8 font, but then rework how to demonstrate extending/overriding the built-in font
      new BpxFontPico8(),
      new Pico8WithAdjustments(),
      new BpxFontSaint11Minimal4(),
      new BpxFontSaint11Minimal5(),
      new CustomFont(),
      new CustomFontExternalImage(),
    ]) {
      b_.setFont(font);

      const [_, wh] = u_.measureText(text);

      // TODO: drawn rect does not cover the blank characters if they are at the end
      b_.drawRectFilled(cursor.sub(1), wh.add(2), rgb_p8_.storm);

      b_.drawText(text, cursor, rgb_p8_.peach);

      // TODO: derive the y offset from the font's single line size
      b_.drawLine(cursor.add(-6, 0), v_(3, 1), rgb_p8_.pink);
      b_.drawLine(cursor.add(-5, 0), v_(1, 4), rgb_p8_.pink);
      b_.drawLine(cursor.add(-6, 4), v_(3, 1), rgb_p8_.pink);

      cursor = cursor.add(0, wh.y + 5);

      // TODO: measuring API - proposal A
      // const { wh } = u_.measureText(text);
      // b_.drawRectFilled(cursor.sub(1), wh.add(2), rgb_p8_.storm);
      // b_.drawText(text, cursor, rgb_p8_.peach);

      // TODO: measuring API - proposal B
      // const computedText: BpxComputedText = b_.computeText(text);
      // b_.drawRect(cursor.sub(1), computedText.wh.add(2), rgb_p8_.storm);
      // b_.drawText(computedText, cursor, rgb_p8_.peach);

      // TODO: measuring API - proposal C
      // b_.drawText(b_.computeText(text), cursor, rgb_p8_.peach);

      // TODO: measuring API - proposal D
      // b_.drawText(text, cursor, rgb_p8_.peach);
    }
  });
  await startGame();
});
