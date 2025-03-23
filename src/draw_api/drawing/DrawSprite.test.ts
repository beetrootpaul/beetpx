import { describe, test } from "vitest";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { $rgb, $spr, $v } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";
import { TestImage } from "../TestImage";

describe("DrawSprite", () => {
  const ct = null;
  const c0 = $rgb("#010203");
  const c1 = $rgb("#111213");
  const c2 = $rgb("#212223");
  const c3 = $rgb("#313233");
  const c4 = $rgb("#414243");
  const c5 = $rgb("#515253");

  test("1x1 image", () => {
    const dts = drawingTestSetup(3, 3, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1 },
      image: `
        #
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(1, 1, 0, 0), $v(1, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(5, 3, 0, 0), $v(3, 2));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(0, 0, 1, 1), $v(2, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(-2, -2, 3, 3), $v(2, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    // These sprite numbers are chosen in away which should test whether
    //   rounding is performed on initial values of w, h, x, y (which is
    //   *not* what we want here) or rather on the calculated ones.
    dts.drawApi.drawSprite(s(2.6, 1.4, 0.6, 1.4), $v(2.49, 0.51));

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

  describe("centering", () => {
    test("no centering", () => {
      const dts = drawingTestSetup(8, 7, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
        # # # #
        # * * *
        # * # *
      `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(3, 3), {
        centerXy: [false, false],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - # # # # -
        - - - # * * * -
        - - - # * # * -
        - - - - - - - -
      `,
      });
    });

    test("X centering", () => {
      const dts = drawingTestSetup(8, 7, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
        # # # #
        # * * *
        # * # *
      `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(3, 3), {
        centerXy: [true, false],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - # # # # - - -
        - # * * * - - -
        - # * # * - - -
        - - - - - - - -
      `,
      });
    });

    test("Y centering", () => {
      const dts = drawingTestSetup(8, 7, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
        # # # #
        # * * *
        # * # *
      `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(3, 3), {
        centerXy: [false, true],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - # # # # -
        - - - # * * * -
        - - - # * # * -
        - - - - - - - -
        - - - - - - - -
      `,
      });
    });

    test("XY centering", () => {
      const dts = drawingTestSetup(8, 7, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
        # # # #
        # * * *
        # * # *
      `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(3, 3), {
        centerXy: [true, true],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - # # # # - - -
        - # * * * - - -
        - # * # * - - -
        - - - - - - - -
        - - - - - - - -
      `,
      });
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
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1), { scaleXy: $v(3, 2) });

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
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1), { scaleXy: $v(-3, -2) });

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
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1), {
        scaleXy: $v(0.9, 0.9),
      });

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
      dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1), {
        scaleXy: $v(1.9, 1.9),
      });

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
      dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(2, 1), {
        scaleXy: $v(3.9, 2.9),
      });

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

  describe("flip", () => {
    test("no flip", () => {
      const dts = drawingTestSetup(6, 5, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
          # # # #
          # * * *
          # * # *
        `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(1, 1), {
        flipXy: [false, false],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # * * * -
          - # * # * -
          - - - - - -
        `,
      });
    });

    test("X flip", () => {
      const dts = drawingTestSetup(6, 5, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
          # # # #
          # * * *
          # * # *
        `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(1, 1), {
        flipXy: [true, false],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - * * * # -
          - * # * # -
          - - - - - -
        `,
      });
    });

    test("Y flip", () => {
      const dts = drawingTestSetup(6, 5, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
          # # # #
          # * * *
          # * # *
        `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(1, 1), {
        flipXy: [false, true],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
          - - - - - -
          - # * # * -
          - # * * * -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("XY flip", () => {
      const dts = drawingTestSetup(6, 5, c0);
      const image = new TestImage({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        image: `
          # # # #
          # * * *
          # * # *
        `,
      });
      const s = $spr(image.uniqueUrl);
      dts.assets.addImageAsset(image.uniqueUrl, image.asset);

      dts.drawApi.drawSprite(s(4, 3, 0, 0), $v(1, 1), {
        flipXy: [true, true],
      });

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "*": c2 },
        expectedImageAsAscii: `
          - - - - - -
          - * # * # -
          - * * * # -
          - # # # # -
          - - - - - -
        `,
      });
    });
  });

  test("scale vs centering vs flip", () => {
    const dts = drawingTestSetup(8, 6, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(2, 2, 1, 1), $v(4, 3), {
      scaleXy: $v(3, 2),
      centerXy: [true, true],
      flipXy: [true, true],
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
          - - - - - - - -
          - : : : % % % -
          - : : : % % % -
          - = = = : : : -
          - = = = : : : -
          - - - - - - - -
        `,
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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 2, -2, 1), $v(3, 3));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 2, 2, 1), $v(3, 3));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(2, 4, 1, -2), $v(3, 3));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(2, 4, 1, 2), $v(3, 3));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(-2, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(4, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(1, -2));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(1, 4));

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

  test("scaled flipped sprite vs canvas clipping: left edge", () => {
    const dts = drawingTestSetup(10, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      image: `
        . . . . . . .
        . . # : % = .
        . . # : = % .
        . . # % : = .
        . . . . . . .
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 3, 2, 1), $v(-2, 1), {
      flipXy: [true, true],
      scaleXy: $v(2),
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      expectedImageAsAscii: `
        - - - - - - - - - -
        : : % % # # - - - -
        : : % % # # - - - -
        = = : : # # - - - -
        = = : : # # - - - -
        % % : : # # - - - -
        % % : : # # - - - -
        - - - - - - - - - -
      `,
    });
  });

  test("scaled flipped sprite vs canvas clipping: right edge", () => {
    const dts = drawingTestSetup(10, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      image: `
        . . . . . . .
        . . # : % = .
        . . # : = % .
        . . # % : = .
        . . . . . . .
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 3, 2, 1), $v(4, 1), {
      flipXy: [true, true],
      scaleXy: $v(2),
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      expectedImageAsAscii: `
        - - - - - - - - - -
        - - - - = = : : % %
        - - - - = = : : % %
        - - - - % % = = : :
        - - - - % % = = : :
        - - - - = = % % : :
        - - - - = = % % : :
        - - - - - - - - - -
      `,
    });
  });

  test("scaled flipped sprite vs canvas clipping: top edge", () => {
    const dts = drawingTestSetup(10, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      image: `
        . . . . . . .
        . . # : % = .
        . . # : = % .
        . . # % : = .
        . . . . . . .
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 3, 2, 1), $v(1, -2), {
      flipXy: [true, true],
      scaleXy: $v(2),
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      expectedImageAsAscii: `
        - % % = = : : # # -
        - % % = = : : # # -
        - = = % % : : # # -
        - = = % % : : # # -
        - - - - - - - - - -
        - - - - - - - - - -
        - - - - - - - - - -
        - - - - - - - - - -
      `,
    });
  });

  test("scaled flipped sprite vs canvas clipping: bottom edge", () => {
    const dts = drawingTestSetup(10, 8, c0);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      image: `
        . . . . . . .
        . . # : % = .
        . . # : = % .
        . . # % : = .
        . . . . . . .
      `,
    });
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 3, 2, 1), $v(1, 4), {
      flipXy: [true, true],
      scaleXy: $v(2),
    });

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": c5 },
      expectedImageAsAscii: `
        - - - - - - - - - -
        - - - - - - - - - -
        - - - - - - - - - -
        - - - - - - - - - -
        - = = : : % % # # -
        - = = : : % % # # -
        - % % = = : : # # -
        - % % = = : : # # -
      `,
    });
  });

  test("sprite vs region clipping", () => {
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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setClippingRegion($v(2, 2), $v(2, 2));
    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(1, 1));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - : = - -
        - - % : - -
        - - - - - -
        - - - - - -
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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(0, 0));
    dts.drawApi.drawSprite(s(4, 4, 4, 0), $v(0, 0));
    dts.drawApi.drawSprite(s(4, 4, 8, 0), $v(0, 0));
    dts.drawApi.drawSprite(s(4, 4, 12, 0), $v(0, 0));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setSpriteColorMapping(
      BpxSpriteColorMapping.from([
        [c1, c4],
        [c2, c5],
        [c3, ct],
      ]),
    );
    dts.drawApi.drawSprite(s(4, 4, 0, 0), $v(0, 0));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setCameraXy($v(3, -2));
    dts.drawApi.drawSprite(s(7, 6, 0, 0), $v(1, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawSprite(s(7, 6, 0, 0), $v(1, 1));

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
    const s = $spr(image.uniqueUrl);
    dts.assets.addImageAsset(image.uniqueUrl, image.asset);

    dts.drawApi.setCameraXy($v(3, -2));
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawSprite(s(7, 6, 0, 0), $v(1, 1));

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
