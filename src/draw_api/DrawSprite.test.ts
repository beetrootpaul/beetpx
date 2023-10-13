import { describe, test } from "@jest/globals";
import { BpxSolidColor, transparent_ } from "../Color";
import { spr_ } from "../Sprite";
import { v2d_ } from "../Vector2d";
import { DrawSprite } from "./DrawSprite";
import { TestCanvas } from "./TestCanvas";
import { TestImage } from "./TestImage";

// TODO: tests for fill pattern

describe("DrawSprite", () => {
  const ct = transparent_;
  const c0 = BpxSolidColor.fromRgbCssHex("#010203");
  const c1 = BpxSolidColor.fromRgbCssHex("#111213");
  const c2 = BpxSolidColor.fromRgbCssHex("#212223");
  const c3 = BpxSolidColor.fromRgbCssHex("#313233");
  const c4 = BpxSolidColor.fromRgbCssHex("#414243");
  const c5 = BpxSolidColor.fromRgbCssHex("#515253");

  const s = spr_("any.image.url");

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
    sprite.draw(image.asset, s(0, 0, 1, 1), v2d_(1, 1), [1, 1], new Map());

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
    sprite.draw(image.asset, s(0, 0, 5, 3), v2d_(3, 2));

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
    sprite.draw(image.asset, s(1, 1, 2, 2), v2d_(2, 1));

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
    sprite.draw(image.asset, s(1, 1, 0, 0), v2d_(2, 1));

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
    sprite.draw(image.asset, s(3, 3, -2, -2), v2d_(2, 1));

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
    sprite.draw(image.asset, s(-2, 1, 4, 2), v2d_(3, 3));

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
    sprite.draw(image.asset, s(2, 1, 4, 2), v2d_(3, 3));

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
    sprite.draw(image.asset, s(1, -2, 2, 4), v2d_(3, 3));

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
    sprite.draw(image.asset, s(1, 2, 2, 4), v2d_(3, 3));

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
    sprite.draw(image.asset, s(0, 0, 4, 4), v2d_(-2, 1));

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
    sprite.draw(image.asset, s(0, 0, 4, 4), v2d_(4, 1));

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
    sprite.draw(image.asset, s(0, 0, 4, 4), v2d_(1, -2));

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
    sprite.draw(image.asset, s(0, 0, 4, 4), v2d_(1, 4));

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
    sprite.draw(image.asset, s(0, 0, 4, 4), v2d_(0, 0));
    sprite.draw(image.asset, s(4, 0, 4, 4), v2d_(0, 0));
    sprite.draw(image.asset, s(8, 0, 4, 4), v2d_(0, 0));
    sprite.draw(image.asset, s(12, 0, 4, 4), v2d_(0, 0));

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
      s(0, 0, 4, 4),
      v2d_(0, 0),
      [1, 1],
      new Map([
        [c1.id, c4],
        [c2.id, c5],
        [c3.id, ct],
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
