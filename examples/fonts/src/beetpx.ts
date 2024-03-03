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
  "The quick [c1]brown[c0] fox jumps over\nthe [c2]lazy[c0] dog 0123456789 .,:;!? @#$%^&* ()[]{}<> -+= \\|/ '\"";

b_.init({
  // TODO: change it to 128x128 if possible, after applying all the line breaks and custom fonts
  gameCanvasSize: "256x256",
  assets: {
    images: [{ url: "custom-font.png" }],
  },
}).then(async ({ startGame }) => {
  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.wine);

    let cursor = v_(2, 2);

    for (const font of [
      // TODO: do not require a construction?
      new BpxFontPico8(),
      new BpxFontSaint11Minimal4(),
      new BpxFontSaint11Minimal5(),
      new CustomFont(),
      // TODO: custom font from external image
      // TODO: extending an existing built-in font with extra glyphs, both pixel- and image-originated at the same time
    ]) {
      b_.setFont(font);

      const [_, wh] = u_.measureText(text);

      // TODO: drawn rect does not cover the blank characters if they are at the end
      b_.drawRectFilled(cursor.sub(1), wh.add(2), rgb_p8_.storm);

      b_.drawText(text, cursor, rgb_p8_.peach);

      cursor = cursor.add(0, wh.y + 3);
    }
  });
  await startGame();
});
