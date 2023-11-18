import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";
import { BpxPattern } from "../Pattern";
import { BpxPixels } from "../Pixels";

describe("DrawPixels", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");

  test("1x1", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from("#"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("a complex and uneven set of bits", () => {
    const dts = drawingTestSetup(18, 10, c0);

    dts.drawApi.pixels(
      v_(1, 1),
      c1,
      BpxPixels.from(`
        ##-##-##
        ##-##-##
        #-#--#-#
        -----------
        -----------
        ################
        ----------##
        #
      `),
    );

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - - - -
        - # # - # # - # # - - - - - - - - -
        - # # - # # - # # - - - - - - - - -
        - # - # - - # - # - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
        - # # # # # # # # # # # # # # # # -
        - - - - - - - - - - - # # - - - - -
        - # - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
      `,
    });
  });

  test("ignored whitespaces", () => {
    const dts = drawingTestSetup(10, 5, c0);

    dts.drawApi.pixels(
      v_(1, 1),
      c1,
      BpxPixels.from(`
      
      
        #           ## # # ###
        
             -###   ##--
        
        
        --    #     #----
        
        
        
      `),
    );

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - 
        - # # # # # # # # - 
        - - # # # # # - - - 
        - - - # # - - - - - 
        - - - - - - - - - - 
      `,
    });
  });

  test("0-size", () => {
    const dts = drawingTestSetup(9, 9, c0);

    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from(""));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
      `,
    });

    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from("    \n  \n \n\n   \n   "));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
        - - - - - - - - -
      `,
    });
  });

  test("rounding", () => {
    const dts = drawingTestSetup(7, 6, c0);

    dts.drawApi.pixels(v_(2.49, 1.51), c1, BpxPixels.from("###\n###"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - -
        - - - - - - -
        - - # # # - -
        - - # # # - -
        - - - - - - -
        - - - - - - -
      `,
    });
  });

  test("clipping: left edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(-2, 1), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        # # - - - -
        # # - - - -
        # # - - - -
        # # - - - -
        - - - - - -
      `,
    });
  });

  test("clipping: right edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(4, 1), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - # #
        - - - - # #
        - - - - # #
        - - - - # #
        - - - - - -
      `,
    });
  });

  test("clipping: top edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(1, -2), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - # # # # -
        - # # # # -
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
      `,
    });
  });

  test("clipping: bottom edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(1, 4), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
        - # # # # -
        - # # # # -
      `,
    });
  });

  test("camera XY", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setCameraXy(v_(3, -2));
    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        # # - - - -
        # # - - - -
        # # - - - -
      `,
    });
  });

  test("pattern", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setPattern(
      BpxPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - # - - # -
        - - # # - -
        - - # # - -
        - # - - # -
        - - - - - -
      `,
    });
  });

  test("camera XY + pattern", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setCameraXy(v_(3, -2));
    dts.drawApi.setPattern(
      BpxPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.pixels(v_(1, 1), c1, BpxPixels.from("####\n####\n####\n####"));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
        # # - - - -
        # # - - - -
      `,
    });
  });
});
