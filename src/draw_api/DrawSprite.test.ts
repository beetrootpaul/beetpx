import { describe, test } from "@jest/globals";
import { SolidColor, transparent_ } from "../Color";
import { spr_ } from "../Sprite";
import { v_ } from "../Vector2d";
import { DrawSprite } from "./DrawSprite";
import { TestCanvas } from "./TestCanvas";
import { TestImage } from "./TestImage";

// TODO: tests for fill pattern

describe("DrawSprite", () => {
  const ct = transparent_;
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");
  const c2 = SolidColor.fromRgbCssHex("#212223");
  const c3 = SolidColor.fromRgbCssHex("#313233");
  const c4 = SolidColor.fromRgbCssHex("#414243");
  const c5 = SolidColor.fromRgbCssHex("#515253");

  test("1x1 image", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1 },
      image: `
        #
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 1, 1), v_(1, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("image with multiple colors", () => {
    // given
    const canvas = new TestCanvas(9, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # # # # #
        # : % : =
        = = = = =
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 5, 3), v_(3, 2), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 1, 2, 2), v_(2, 1), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 1, 0, 0), v_(2, 1), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(3, 3, -2, -2), v_(2, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: left edge", () => {
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(-2, 1, 4, 2), v_(3, 3), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(2, 1, 4, 2), v_(3, 3), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, -2, 2, 4), v_(3, 3), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 2, 2, 4), v_(3, 3), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), v_(-2, 1), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), v_(4, 1), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), v_(1, -2), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), v_(1, 4), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(4, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": ct },
      image: `
        # # # # : . . : . % . . = . . =
        # . . # . . . . % . . . . = = .
        # . . # . . . . . . . % = . . =
        # # # # : . . : . . % . . = = .
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), v_(0, 0), new Map());
    sprite.draw(image.asset, spr_(4, 0, 4, 4), v_(0, 0), new Map());
    sprite.draw(image.asset, spr_(8, 0, 4, 4), v_(0, 0), new Map());
    sprite.draw(image.asset, spr_(12, 0, 4, 4), v_(0, 0), new Map());

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(4, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, ".": ct },
      image: `
        : # # :
        % . . %
        : % % :
        # . . #
      `,
    });

    // when
    sprite.draw(
      image.asset,
      spr_(0, 0, 4, 4),
      v_(0, 0),
      new Map([
        [c1.id(), c4],
        [c2.id(), c5],
        [c3.id(), ct],
      ]),
    );

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
      expectedImageAsAscii: `
        ^ = = ^
        - - - -
        ^ - - ^
        = - - =
      `,
    });
  });
});
