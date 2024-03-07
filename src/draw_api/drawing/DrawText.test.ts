import { beforeEach, describe, test } from "vitest";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxFont, BpxGlyph } from "../../font/Font";
import { spr_, v_ } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { DrawingTestSetup, drawingTestSetup } from "../DrawingTestSetup";
import { BpxPixels } from "../Pixels";
import { TestImage } from "../TestImage";

// TODO: uncomment tests and fix them
// TODO: test kerning across "[c1]" marker, e.g. "J[c1]K"

// TODO: test for text measurement
// test("#measureText", () => {
// vi.spyOn(BeetPx, "getFont").mockImplementation(
//   () =>
//     new (class implements BpxFont {
//       id = "test-font";
//       spriteTextColor = null;
//       imageUrl = "any.image/url";
//       spritesFor(text: string): BpxCharSprite[] {
//         const sprites: BpxCharSprite[] = [];
//         let positionInText = v_0_0_;
//         for (let i = 0; i < text.length; i += 1) {
//           //
//           // data for test assertions where chars are tiny and jumps are huge
//           //
//           if (text[i] === ".") {
//             sprites.push({
//               char: ".",
//               positionInText,
//               type: "pixels",
//               // pixels of a size 1 x 2
//               pixels: BpxPixels.from("-\n#"),
//             });
//             positionInText = positionInText.add(100, -200);
//           }
//           if (text[i] === "o") {
//             sprites.push({
//               char: "o",
//               positionInText,
//               type: "image",
//               spriteXyWh: [v_(50_000, 60_000), v_(30, 40)],
//             });
//             positionInText = positionInText.add(-3_000, 4_000);
//           }
//           //
//           // data for test assertions where chars are huge and jumps are tiny
//           //
//           if (text[i] === "x") {
//             sprites.push({
//               char: "x",
//               positionInText,
//               type: "pixels",
//               // pixels of a size 100 x 200
//               pixels: BpxPixels.from(
//                 u_
//                   .range(200)
//                   .map(
//                     (_) => "-".repeat(25) + "#".repeat(50) + "-".repeat(25),
//                   )
//                   .join("\n"),
//               ),
//             });
//             positionInText = positionInText.add(1, -2);
//           }
//           if (text[i] === "#") {
//             sprites.push({
//               char: "#",
//               positionInText,
//               type: "image",
//               spriteXyWh: [v_(50_000, 60_000), v_(3_000, 4_000)],
//             });
//             positionInText = positionInText.add(-30, 40);
//           }
//         }
//         return sprites;
//       }
//     })(),
// );
//
// assertions where chars are tiny and jumps are huge
//
// expect(BpxUtils.measureText(".")).toEqual([v_(0, 0), v_(1, 2)]);
// expect(BpxUtils.measureText("o")).toEqual([v_(0, 0), v_(30, 40)]);
// expect(BpxUtils.measureText("...")).toEqual([v_(0, -400), v_(201, 402)]);
// expect(BpxUtils.measureText("ooo")).toEqual([
//   v_(-6_000, 0),
//   v_(6_030, 8_040),
// ]);
// expect(BpxUtils.measureText(".o.o.o")).toEqual([
//   v_(-5_800, -200),
//   v_(5_930, 7_802),
// ]);
//
// assertions where chars are huge and jumps are tiny
//
// expect(BpxUtils.measureText("x")).toEqual([v_(0, 0), v_(100, 200)]);
// expect(BpxUtils.measureText("#")).toEqual([v_(0, 0), v_(3_000, 4_000)]);
// expect(BpxUtils.measureText("xxx")).toEqual([v_(0, -4), v_(102, 204)]);
// expect(BpxUtils.measureText("###")).toEqual([v_(-60, 0), v_(3_060, 4_080)]);
// expect(BpxUtils.measureText("x#x#x#")).toEqual([
//   v_(-58, -2),
//   v_(3_059, 4_076),
// ]);
// });

describe("DrawText", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const cFontBg = BpxRgbColor.fromCssHex("#818283");
  const cFontFg = BpxRgbColor.fromCssHex("#919293");

  const fontImage = new TestImage({
    withMapping: { _: cFontBg, X: cFontFg },
    image: `
        X X _ _ X X X _ _ _ 
        X _ X _ X X X X _ X 
        X X X _ X X X X _ X 
        X _ _ X X X X _ X _ 
        X _ _ X X X X X _ X 
        X X X _ X X X X _ X 
      `,
  });

  class TestFont extends BpxFont {
    readonly ascent = 6;

    readonly descent = 2;

    readonly lineGap = 1;

    readonly spriteSheetUrls = [fontImage.uniqueUrl];

    protected isSpriteSheetTextColor(color: BpxRgbColor | null): boolean {
      return color?.cssHex === cFontFg.cssHex;
    }

    protected readonly glyphs = new Map<string, BpxGlyph>([
      [
        "B",
        {
          type: "sprite",
          sprite: spr_(fontImage.uniqueUrl)(4, 6, 0, 0),
          advance: 5,
        },
      ],
      [
        "p",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##-
            #-#
            ##-
            #--
            #--
          `),
          advance: 4,
        },
      ],
      [
        "x",
        {
          type: "sprite",
          sprite: spr_(fontImage.uniqueUrl)(3, 5, 7, 1),
          advance: 4,
        },
      ],
      [
        ",",
        {
          type: "sprite",
          sprite: spr_(fontImage.uniqueUrl)(2, 3, 8, 1),
          advance: 4,
          offset: v_(0, 2),
          kerning: { x: -1 },
        },
      ],
    ]);

    protected mapChar(char: string): string {
      return char;
    }
  }

  let dts: DrawingTestSetup;

  // TODO: rework it, do not return a new instance every time
  // vi.spyOn(BeetPx, "getFont").mockImplementation(() => new TestFont());

  beforeEach(() => {
    // // TestFont.gapBetweenChars = v_(1, 0);
  });

  test("simple printing", () => {
    dts = drawingTestSetup(14, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(new TestFont());
    // dts.drawApi.drawText("Bpx,", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - - - -
    //     - # # - - - - - - - - - - - - -
    //     - # - # - - # # - - # - # - - -
    //     - # # # - - # - # - # - # - - -
    //     - # - - # - # # - - - # - - - -
    //     - # - - # - # - - - # - # - - -
    //     - # # # - - # - - - # - # - # -
    //     - - - - - - - - - - - - - - # -
    //     - - - - - - - - - - - - - # - -
    //     - - - - - - - - - - - - - - - -
    //   `,
    // });
  });

  test("a gap between characters", () => {
    dts = drawingTestSetup(16, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    // TestFont.gapBetweenChars = v_(0, 0);
    // dts.drawApi.drawText("BPX", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - - - -
    //     - # # - - - - - - - - - - - - -
    //     - # - # - # # - # - # - - - - -
    //     - # # # - # - # # - # - - - - -
    //     - # - - # # # - - # - - - - - -
    //     - # - - # # - - # - # - - - - -
    //     - # # # - # - - # - # - - - - -
    //     - - - - - - - - - - - - - - - -
    //   `,
    // });

    dts.drawApi.clearCanvas(c0);
    // TestFont.gapBetweenChars = v_(2, -1);
    // dts.drawApi.drawText("BPX", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - # - # -
    //     - # # - - - - # # - - - # - # -
    //     - # - # - - - # - # - - - # - -
    //     - # # # - - - # # - - - # - # -
    //     - # - - # - - # - - - - # - # -
    //     - # - - # - - # - - - - - - - -
    //     - # # # - - - - - - - - - - - -
    //     - - - - - - - - - - - - - - - -
    //   `,
    // });
  });

  test("color as a function of a char", () => {
    dts = drawingTestSetup(14, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    // // dts.drawApi.drawText("BPX", v_(1, 1), (charSprite) => {
    //   return charSprite.char === "B" ? c2 : charSprite.char === "X" ? c3 : c1;
    // });

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1, "%": c2, "*": c3 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - -
    //     - % % - - - - - - - - - - -
    //     - % - % - - # # - - * - * -
    //     - % % % - - # - # - * - * -
    //     - % - - % - # # - - - * - -
    //     - % - - % - # - - - * - * -
    //     - % % % - - # - - - * - * -
    //     - - - - - - - - - - - - - -
    //   `,
    // });
  });

  describe("centering", () => {
    test("no centering", () => {
      dts = drawingTestSetup(20, 11, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(7, 4), c1, { centerXy: [false, false] });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - # # - - - - - - - - - - -
      //     - - - - - - - # - # - - # # - - # - # -
      //     - - - - - - - # # # - - # - # - # - # -
      //     - - - - - - - # - - # - # # - - - # - -
      //     - - - - - - - # - - # - # - - - # - # -
      //     - - - - - - - # # # - - # - - - # - # -
      //     - - - - - - - - - - - - - - - - - - - -
      //   `,
      // });
    });

    test("X centering", () => {
      dts = drawingTestSetup(20, 11, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(7, 4), c1, { centerXy: [true, false] });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - # # - - - - - - - - - - - - - - - - -
      //     - # - # - - # # - - # - # - - - - - - -
      //     - # # # - - # - # - # - # - - - - - - -
      //     - # - - # - # # - - - # - - - - - - - -
      //     - # - - # - # - - - # - # - - - - - - -
      //     - # # # - - # - - - # - # - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //   `,
      // });
    });

    test("Y centering", () => {
      dts = drawingTestSetup(20, 11, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(7, 4), c1, { centerXy: [false, true] });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - # # - - - - - - - - - - -
      //     - - - - - - - # - # - - # # - - # - # -
      //     - - - - - - - # # # - - # - # - # - # -
      //     - - - - - - - # - - # - # # - - - # - -
      //     - - - - - - - # - - # - # - - - # - # -
      //     - - - - - - - # # # - - # - - - # - # -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //   `,
      // });
    });

    test("XY centering", () => {
      dts = drawingTestSetup(20, 11, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(7, 4), c1, { centerXy: [true, true] });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - - - - - - - -
      //     - # # - - - - - - - - - - - - - - - - -
      //     - # - # - - # # - - # - # - - - - - - -
      //     - # # # - - # - # - # - # - - - - - - -
      //     - # - - # - # # - - - # - - - - - - - -
      //     - # - - # - # - - - # - # - - - - - - -
      //     - # # # - - # - - - # - # - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - - - - - - - -
      //   `,
      // });
    });
  });

  test("rounding", () => {
    dts = drawingTestSetup(16, 10, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    // dts.drawApi.drawText("BPX", v_(2.49, 1.51), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - - - -
    //     - - # # - - - - - - - - - - - -
    //     - - # - # - - # # - - # - # - -
    //     - - # # # - - # - # - # - # - -
    //     - - # - - # - # # - - - # - - -
    //     - - # - - # - # - - - # - # - -
    //     - - # # # - - # - - - # - # - -
    //     - - - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - - - -
    //   `,
    // });
  });

  describe("scale", () => {
    test("an integer positive scale", () => {
      dts = drawingTestSetup(26, 14, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(1, 1), c1, { scaleXy: v_(2, 2) });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - - - - - - - - - - - - - -
      //     - # # # # - - - - - - - - - - - - - - - - - - - - -
      //     - # # # # - - - - - - - - - - - - - - - - - - - - -
      //     - # # - - # # - - - - # # # # - - - - # # - - # # -
      //     - # # - - # # - - - - # # # # - - - - # # - - # # -
      //     - # # # # # # - - - - # # - - # # - - # # - - # # -
      //     - # # # # # # - - - - # # - - # # - - # # - - # # -
      //     - # # - - - - # # - - # # # # - - - - - - # # - - -
      //     - # # - - - - # # - - # # # # - - - - - - # # - - -
      //     - # # - - - - # # - - # # - - - - - - # # - - # # -
      //     - # # - - - - # # - - # # - - - - - - # # - - # # -
      //     - # # # # # # - - - - # # - - - - - - # # - - # # -
      //     - # # # # # # - - - - # # - - - - - - # # - - # # -
      //     - - - - - - - - - - - - - - - - - - - - - - - - - -
      //   `,
      // });
    });

    test("a negative scale: fallback to a scale of (0,0)", () => {
      dts = drawingTestSetup(14, 8, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(1, 1), c1, { scaleXy: v_(-3, -2) });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //   `,
      // });
    });

    test("a non-integer scale: floor", () => {
      dts = drawingTestSetup(14, 8, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      // dts.drawApi.useFont(new TestFont());
      // dts.drawApi.drawText("BPX", v_(1, 1), c1, { scaleXy: v_(0.9, 0.9) });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //     - - - - - - - - - - - - - -
      //   `,
      // });

      dts.drawApi.clearCanvas(c0);
      // dts.drawApi.drawText("BPX", v_(1, 1), c1, { scaleXy: v_(1.9, 1.9) });

      // dts.canvas.expectToEqual({
      //   withMapping: { "-": c0, "#": c1 },
      //   expectedImageAsAscii: `
      //     - - - - - - - - - - - - - -
      //     - # # - - - - - - - - - - -
      //     - # - # - - # # - - # - # -
      //     - # # # - - # - # - # - # -
      //     - # - - # - # # - - - # - -
      //     - # - - # - # - - - # - # -
      //     - # # # - - # - - - # - # -
      //     - - - - - - - - - - - - - -
      //   `,
      // });
    });
  });

  test("clipping", () => {
    dts = drawingTestSetup(7, 3, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    // dts.drawApi.drawText("BPX", v_(-3, -2), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //       - - # - # - #
    //       # - # # - - -
    //       # - # - - - #
    //     `,
    // });
  });

  test("camera XY", () => {
    dts = drawingTestSetup(14, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    dts.drawApi.setCameraXy(v_(2, -3));
    // dts.drawApi.drawText("BPX", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     # - - - - - - - - - - - - -
    //     - # - - # # - - # - # - - -
    //     # # - - # - # - # - # - - -
    //     - - # - # # - - - # - - - -
    //   `,
    // });
  });

  test("pattern", () => {
    dts = drawingTestSetup(14, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    // dts.drawApi.drawText("BPX", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - -
    //     - # - - - - - - - - - - - -
    //     - - - # - - # # - - # - - -
    //     - - # # - - # - - - # - - -
    //     - # - - # - - - - - - - - -
    //     - # - - # - - - - - - - # -
    //     - - # # - - # - - - # - - -
    //     - - - - - - - - - - - - - -
    //   `,
    // });
  });

  test("camera XY + pattern", () => {
    dts = drawingTestSetup(14, 8, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    // dts.drawApi.useFont(new TestFont());
    dts.drawApi.setCameraXy(v_(2, -3));
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    // dts.drawApi.drawText("BPX", v_(1, 1), c1);

    // dts.canvas.expectToEqual({
    //   withMapping: { "-": c0, "#": c1 },
    //   expectedImageAsAscii: `
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     - - - - - - - - - - - - - -
    //     # - - - - - - - - - - - - -
    //     - # - - # # - - # - - - - -
    //     - - - - - - # - - - # - - -
    //     - - # - - - - - - - - - - -
    //   `,
    // });
  });
});
