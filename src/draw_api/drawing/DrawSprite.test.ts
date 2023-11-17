import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";
import { BpxPattern } from "../Pattern";
import { spr_ } from "../Sprite";
import { TestImage } from "../TestImage";

describe("DrawSprite", () => {
  const ct = null;
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");
  const c5 = BpxRgbColor.fromCssHex("#515253");

  test("1x1 image", () => {
    const dts = drawingTestSetup(3, 3, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1 },
      image: `
        #
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 1, 1), v_(1, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("image with multiple colors", () => {
    const dts = drawingTestSetup(9, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # # # # #
        # : % : =
        = = = = =
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 5, 3), v_(3, 2));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - # # # # # -
        - - - # : % : = -
        - - - = = = = = -
        - - - - - - - - -
      `,
    });
  });

  test("a sprite from a bigger image", () => {
    const dts = drawingTestSetup(5, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  test("a 0-size sprite", () => {
    const dts = drawingTestSetup(5, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(1, 1, 0, 0), v_(2, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - - - -
        - - - - -
        - - - - -
      `,
    });
  });

  test("a negative size sprite", () => {
    const dts = drawingTestSetup(5, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(3, 3, -2, -2), v_(2, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  test("rounding", () => {
    const dts = drawingTestSetup(5, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    // These sprite numbers are chosen in away which should test whether
    //   rounding is performed before on initial values of xy and wh (which
    //   is *not* what we want here) or rather on calculated xy1 and x2.
    dts.drawApi.sprite(s(0.6, 1.4, 2.6, 1.4), v_(2.49, 0.51));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  describe("scale", () => {
    test("an integer positive scale", () => {
      const dts = drawingTestSetup(9, 6, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
      });
      const s = spr_(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1), { scaleXy: v_(3, 2) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - : : : = = = -
          - - : : : = = = -
          - - % % % : : : -
          - - % % % : : : -
          - - - - - - - - -
        `,
      });
    });

    test("a negative scale: fallback to a scale of (0,0)", () => {
      const dts = drawingTestSetup(9, 6, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
      });
      const s = spr_(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1), { scaleXy: v_(-3, -2) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
        `,
      });
    });

    test("a non-integer scale: floor", () => {
      const dts = drawingTestSetup(9, 6, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
      });
      const s = spr_(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1), { scaleXy: v_(0.9, 0.9) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
        `,
      });

      dts.drawApi.clearCanvas(c0);
      dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1), { scaleXy: v_(1.9, 1.9) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - : = - - - - -
          - - % : - - - - -
          - - - - - - - - -
          - - - - - - - - -
          - - - - - - - - -
        `,
      });

      dts.drawApi.clearCanvas(c0);
      dts.drawApi.sprite(s(1, 1, 2, 2), v_(2, 1), { scaleXy: v_(3.9, 2.9) });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - : : : = = = -
          - - : : : = = = -
          - - % % % : : : -
          - - % % % : : : -
          - - - - - - - - -
        `,
      });
    });
  });

  test("sprite vs source image clipping: left edge", () => {
    const dts = drawingTestSetup(8, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(-2, 1, 4, 2), v_(3, 3));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - # : - - -
        - - - # % - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: right edge", () => {
    const dts = drawingTestSetup(8, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(2, 1, 4, 2), v_(3, 3));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - = % - - -
        - - - : = - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: top edge", () => {
    const dts = drawingTestSetup(8, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(1, -2, 2, 4), v_(3, 3));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - : % - - -
        - - - : = - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: bottom edge", () => {
    const dts = drawingTestSetup(8, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(1, 2, 2, 4), v_(3, 3));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - % : - - -
        - - - = : - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: left edge", () => {
    const dts = drawingTestSetup(6, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 4, 4), v_(-2, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        % = - - - -
        = % - - - -
        : = - - - -
        : % - - - -
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: right edge", () => {
    const dts = drawingTestSetup(6, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 4, 4), v_(4, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - # :
        - - - - # :
        - - - - # %
        - - - - # =
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: top edge", () => {
    const dts = drawingTestSetup(6, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 4, 4), v_(1, -2));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - # % : = -
        - # = : % -
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: bottom edge", () => {
    const dts = drawingTestSetup(6, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 4, 4), v_(1, 4));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
        - # : % = -
        - # : = % -
      `,
    });
  });

  test("transparency", () => {
    const dts = drawingTestSetup(4, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": ct },
      image: `
        # # # # : . . : . % . . = . . =
        # . . # . . . . % . . . . = = .
        # . . # . . . . . . . % = . . =
        # # # # : . . : . . % . . = = .
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.sprite(s(0, 0, 4, 4), v_(0, 0));
    dts.drawApi.sprite(s(4, 0, 4, 4), v_(0, 0));
    dts.drawApi.sprite(s(8, 0, 4, 4), v_(0, 0));
    dts.drawApi.sprite(s(12, 0, 4, 4), v_(0, 0));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        = % # =
        % = = #
        = - - =
        : = = :
      `,
    });
  });

  test("color mapping", () => {
    const dts = drawingTestSetup(4, 4, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, ".": ct },
      image: `
        : # # :
        % . . %
        : % % :
        # . . #
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setSpriteColorMapping(
      BpxSpriteColorMapping.from([
        [c1, c4],
        [c2, c5],
        [c3, ct],
      ]),
    );
    dts.drawApi.sprite(s(0, 0, 4, 4), v_(0, 0));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
      expectedImageAsAscii: `
        ^ = = ^
        - - - -
        ^ - - ^
        = - - =
      `,
    });
  });

  test("camera XY", () => {
    const dts = drawingTestSetup(9, 8, c0);
    const image = new TestImage({
      withMapping: { "#": c1, ".": ct },
      image: `
        . . . # # # .
        . # # # . . #
        # # . # . # #
        # # . # . # #
        # . . # # # .
        . # # # . . .
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setCameraXy(v_(3, -2));
    dts.drawApi.sprite(s(0, 0, 7, 6), v_(1, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - # # # - - - - -
        # # - - # - - - -
        - # - # # - - - -
        - # - # # - - - -
        - # # # - - - - -
      `,
    });
  });

  test("pattern", () => {
    const dts = drawingTestSetup(9, 8, c0);
    const image = new TestImage({
      withMapping: { "#": c1, ".": ct },
      image: `
        . . . # # # .
        . # # # . . #
        # # . # . # #
        # # . # . # #
        # . . # # # .
        . # # # . . .
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.sprite(s(0, 0, 7, 6), v_(1, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - # # - - -
        - - # # - - - # -
        - - # - - - # # -
        - # - - # - - - -
        - # - - # # - - -
        - - # # - - - - -
        - - - - - - - - -
      `,
    });
  });

  test("camera XY + pattern", () => {
    const dts = drawingTestSetup(9, 8, c0);
    const image = new TestImage({
      withMapping: { "#": c1, ".": ct },
      image: `
        . . . # # # .
        . # # # . . #
        # # . # . # #
        # # . # . # #
        # . . # # # .
        . # # # . . .
      `,
    });
    const s = spr_(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setCameraXy(v_(3, -2));
    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.sprite(s(0, 0, 7, 6), v_(1, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - # # - - - - -
        # # - - # - - - -
        - # - - # - - - -
        - - - # - - - - -
        - - # # - - - - -
      `,
    });
  });
});
