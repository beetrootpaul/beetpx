import { describe, test } from "vitest";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxGlyph } from "../../font/Font";
import { font_, spr_, v_ } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { DrawingTestSetup, drawingTestSetup } from "../DrawingTestSetup";
import { BpxPixels } from "../Pixels";
import { TestImage } from "../TestImage";

describe("DrawText", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");
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

  const testFont = font_({
    ascent: 6,
    descent: 2,
    lineGap: 1,

    glyphs: new Map<string, BpxGlyph>([
      [
        "B",
        {
          type: "sprite",
          sprite: spr_(fontImage.uniqueUrl)(4, 6, 0, 0),
          isTextColor: sc => sc?.cssHex === cFontFg.cssHex,
          advance: 5,
        },
      ],
      [
        "m",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##-#-
            #-#-#
            #-#-#
            #-#-#
          `),
          advance: 6,
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
          isTextColor: sc => sc?.cssHex === cFontFg.cssHex,
          advance: 4,
        },
      ],
      [
        ",",
        {
          type: "sprite",
          sprite: spr_(fontImage.uniqueUrl)(2, 3, 8, 1),
          isTextColor: sc => sc?.cssHex === cFontFg.cssHex,
          advance: 4,
          offset: v_(0, 2),
          kerning: { B: -1, x: -1 },
        },
      ],
      [
        "[",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##
            #-
            #-
            #-
            ##
          `),
          advance: 3,
        },
      ],
      [
        "]",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##
            -#
            -#
            -#
            ##
          `),
          advance: 3,
        },
      ],
    ]),
  });

  let dts: DrawingTestSetup;

  test("simple printing", () => {
    dts = drawingTestSetup(16, 10, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.drawText("Bpx,", v_(1, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - -
        - # # - - - - - - - - - - - - -
        - # - # - - # # - - # - # - - -
        - # # # - - # - # - # - # - - -
        - # - - # - # # - - - # - - - -
        - # - - # - # - - - # - # - - -
        - # # # - - # - - - # - # - # -
        - - - - - - - - - - - - - - # -
        - - - - - - - - - - - - - # - -
        - - - - - - - - - - - - - - - -
      `,
    });
  });

  describe("centering", () => {
    test("no centering", () => {
      dts = drawingTestSetup(23, 14, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(8, 5), c1, { centerXy: [false, false] });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - # # - - - - - - - - - - - - -
          - - - - - - - - # - # - - # # - - # - # - - -
          - - - - - - - - # # # - - # - # - # - # - - -
          - - - - - - - - # - - # - # # - - - # - - - -
          - - - - - - - - # - - # - # - - - # - # - - -
          - - - - - - - - # # # - - # - - - # - # - # -
          - - - - - - - - - - - - - - - - - - - - - # -
          - - - - - - - - - - - - - - - - - - - - # - -
          - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("X centering", () => {
      dts = drawingTestSetup(23, 14, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(8, 5), c1, { centerXy: [true, false] });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - # # - - - - - - - - - - - - - - - - - - - -
          - # - # - - # # - - # - # - - - - - - - - - -
          - # # # - - # - # - # - # - - - - - - - - - -
          - # - - # - # # - - - # - - - - - - - - - - -
          - # - - # - # - - - # - # - - - - - - - - - -
          - # # # - - # - - - # - # - # - - - - - - - -
          - - - - - - - - - - - - - - # - - - - - - - -
          - - - - - - - - - - - - - # - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("Y centering", () => {
      dts = drawingTestSetup(23, 14, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(8, 5), c1, { centerXy: [false, true] });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - # # - - - - - - - - - - - - -
          - - - - - - - - # - # - - # # - - # - # - - -
          - - - - - - - - # # # - - # - # - # - # - - -
          - - - - - - - - # - - # - # # - - - # - - - -
          - - - - - - - - # - - # - # - - - # - # - - -
          - - - - - - - - # # # - - # - - - # - # - # -
          - - - - - - - - - - - - - - - - - - - - - # -
          - - - - - - - - - - - - - - - - - - - - # - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("XY centering", () => {
      dts = drawingTestSetup(23, 14, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(8, 5), c1, { centerXy: [true, true] });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - -
          - # # - - - - - - - - - - - - - - - - - - - -
          - # - # - - # # - - # - # - - - - - - - - - -
          - # # # - - # - # - # - # - - - - - - - - - -
          - # - - # - # # - - - # - - - - - - - - - - -
          - # - - # - # - - - # - # - - - - - - - - - -
          - # # # - - # - - - # - # - # - - - - - - - -
          - - - - - - - - - - - - - - # - - - - - - - -
          - - - - - - - - - - - - - # - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });
  });

  test("rounding", () => {
    dts = drawingTestSetup(18, 12, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.drawText("Bpx,", v_(2.49, 1.51), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
        - - # # - - - - - - - - - - - - - -
        - - # - # - - # # - - # - # - - - -
        - - # # # - - # - # - # - # - - - -
        - - # - - # - # # - - - # - - - - -
        - - # - - # - # - - - # - # - - - -
        - - # # # - - # - - - # - # - # - -
        - - - - - - - - - - - - - - - # - -
        - - - - - - - - - - - - - - # - - -
        - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
      `,
    });
  });

  describe("scale", () => {
    test("an integer positive scale", () => {
      dts = drawingTestSetup(44, 18, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(1, 1), c1, { scaleXy: v_(3, 2) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - # # # # # # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - # # # # # # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - # # # - - - # # # - - - - - - # # # # # # - - - - - - # # # - - - # # # - - - - - - -
          - # # # - - - # # # - - - - - - # # # # # # - - - - - - # # # - - - # # # - - - - - - -
          - # # # # # # # # # - - - - - - # # # - - - # # # - - - # # # - - - # # # - - - - - - -
          - # # # # # # # # # - - - - - - # # # - - - # # # - - - # # # - - - # # # - - - - - - -
          - # # # - - - - - - # # # - - - # # # # # # - - - - - - - - - # # # - - - - - - - - - -
          - # # # - - - - - - # # # - - - # # # # # # - - - - - - - - - # # # - - - - - - - - - -
          - # # # - - - - - - # # # - - - # # # - - - - - - - - - # # # - - - # # # - - - - - - -
          - # # # - - - - - - # # # - - - # # # - - - - - - - - - # # # - - - # # # - - - - - - -
          - # # # # # # # # # - - - - - - # # # - - - - - - - - - # # # - - - # # # - - - # # # -
          - # # # # # # # # # - - - - - - # # # - - - - - - - - - # # # - - - # # # - - - # # # -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - # # # -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - # # # -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - # # # - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - # # # - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("a negative scale: fallback to a scale of (0,0)", () => {
      dts = drawingTestSetup(16, 10, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(1, 1), c1, { scaleXy: v_(-3, -2) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("a non-integer scale: floor", () => {
      dts = drawingTestSetup(16, 10, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("Bpx,", v_(1, 1), c1, { scaleXy: v_(0.9, 0.9) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });

      dts.drawApi.clearCanvas(c0);
      dts.drawApi.drawText("Bpx,", v_(1, 1), c1, { scaleXy: v_(1.9, 1.9) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - # # - - - - - - - - - - - - -
          - # - # - - # # - - # - # - - -
          - # # # - - # - # - # - # - - -
          - # - - # - # # - - - # - - - -
          - # - - # - # - - - # - # - - -
          - # # # - - # - - - # - # - # -
          - - - - - - - - - - - - - - # -
          - - - - - - - - - - - - - # - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });
  });

  test("scale vs centering", () => {
    dts = drawingTestSetup(26, 18, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.drawText("B,", v_(13, 9), c1, {
      centerXy: [true, true],
      scaleXy: v_(4, 2),
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - - - - -
          - # # # # # # # # - - - - - - - - - - - - - - - - -
          - # # # # # # # # - - - - - - - - - - - - - - - - -
          - # # # # - - - - # # # # - - - - - - - - - - - - -
          - # # # # - - - - # # # # - - - - - - - - - - - - -
          - # # # # # # # # # # # # - - - - - - - - - - - - -
          - # # # # # # # # # # # # - - - - - - - - - - - - -
          - # # # # - - - - - - - - # # # # - - - - - - - - -
          - # # # # - - - - - - - - # # # # - - - - - - - - -
          - # # # # - - - - - - - - # # # # - - - - - - - - -
          - # # # # - - - - - - - - # # # # - - - - - - - - -
          - # # # # # # # # # # # # - - - - - - - - # # # # -
          - # # # # # # # # # # # # - - - - - - - - # # # # -
          - - - - - - - - - - - - - - - - - - - - - # # # # -
          - - - - - - - - - - - - - - - - - - - - - # # # # -
          - - - - - - - - - - - - - - - - - # # # # - - - - -
          - - - - - - - - - - - - - - - - - # # # # - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - -
        `,
    });
  });

  test("clipping", () => {
    dts = drawingTestSetup(7, 3, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.drawText("Bpx,", v_(-3, -2), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - # - # - #
          # - # # - - -
          # - # - - - #
        `,
    });
  });

  test("camera XY", () => {
    dts = drawingTestSetup(16, 10, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.setCameraXy(v_(2, -5));
    dts.drawApi.drawText("Bpx,", v_(1, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        # - - - - - - - - - - - - - - -
        - # - - # # - - # - # - - - - -
        # # - - # - # - # - # - - - - -
        - - # - # # - - - # - - - - - -
      `,
    });
  });

  test("pattern", () => {
    dts = drawingTestSetup(16, 10, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawText("Bpx,", v_(1, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - -
        - # - - - - - - - - - - - - - -
        - - - # - - # # - - # - - - - -
        - - # # - - # - - - # - - - - -
        - # - - # - - - - - - - - - - -
        - # - - # - - - - - - - # - - -
        - - # # - - # - - - # - - - # -
        - - - - - - - - - - - - - - # -
        - - - - - - - - - - - - - # - -
        - - - - - - - - - - - - - - - -
      `,
    });
  });

  test("camera XY + pattern", () => {
    dts = drawingTestSetup(16, 10, c0);
    dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

    dts.drawApi.useFont(testFont);
    dts.drawApi.setCameraXy(v_(2, -3));
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawText("Bpx,", v_(1, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - -
        # - - - - - - - - - - - - - - -
        - # - - # # - - # - - - - - - -
        - - - - - - # - - - # - - - - -
        - - # - - - - - - - - - - - - -
        - - - - # - - - # - - - - - - -
        # # - - # - - - # - - - # - - -
      `,
    });
  });

  describe("color markers", () => {
    test("use defined color markers to affect the color of subsequent characters", () => {
      dts = drawingTestSetup(28, 10, c0);
      dts.assets.addImageAsset(fontImage.uniqueUrl, fontImage.asset);

      dts.drawApi.useFont(testFont);
      dts.drawApi.drawText("B[m2]p[m3]x[m4],", v_(1, 1), c1, {
        colorMarkers: {
          m2: c2,
          m4: c4,
        },
      });

      // explanation:
      //  - "B" is printed with color "c1"
      //  - "[m2]" changes the color to "c2"
      //  - "p" is printed with color "c2"
      //  - "[m3]" is not defined in "colorMarkers", therefore is printed as is… but you see "[x]" only, because "3" is not defined in TestFont
      //  - "x" is printed with color "c2" (continuation of the "[m2]" marker)
      //  - "[m4]" changes the color to "c4"
      //  - "," is printed with color "c4"
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "$": c2, "%": c3, "@": c4 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - # # - - - - - - - - - - - - - - - - - - - - - - - - -
          - # - # - - $ $ - - $ $ - - - - - - - $ $ - $ - $ - - -
          - # # # - - $ - $ - $ - - $ $ - $ - - - $ - $ - $ - - -
          - # - - # - $ $ - - $ - - $ - $ - $ - - $ - - $ - - - -
          - # - - # - $ - - - $ - - $ - $ - $ - - $ - $ - $ - - -
          - # # # - - $ - - - $ $ - $ - $ - $ - $ $ - $ - $ - @ -
          - - - - - - - - - - - - - - - - - - - - - - - - - - @ -
          - - - - - - - - - - - - - - - - - - - - - - - - - @ - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        `,
      });
    });
  });
});
