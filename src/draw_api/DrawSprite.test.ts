import { describe, test } from "@jest/globals";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { transparent_ } from "../color/TransparentColor";
import { v_, v_1_1_ } from "../misc/Vector2d";
import { DrawSprite } from "./DrawSprite";
import { spr_ } from "./Sprite";
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

  test("1x1 image", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const sprite = new DrawSprite(canvas.canvas);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1 },
      image: `
        #
      `,
    });
    const s = spr_(image.uniqueUrl);

    // when
    sprite.draw(image.asset, s(0, 0, 1, 1), v_(1, 1), v_1_1_);

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
    const sprite = new DrawSprite(canvas.canvas);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # # # # #
        # : % : =
        = = = = =
      `,
    });
    const s = spr_(image.uniqueUrl);

    // when
    sprite.draw(image.asset, s(0, 0, 5, 3), v_(3, 2));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(1, 1, 2, 2), v_(2, 1));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(1, 1, 0, 0), v_(2, 1));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(3, 3, -2, -2), v_(2, 1));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(-2, 1, 4, 2), v_(3, 3));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(2, 1, 4, 2), v_(3, 3));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(1, -2, 2, 4), v_(3, 3));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(1, 2, 2, 4), v_(3, 3));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(0, 0, 4, 4), v_(-2, 1));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(0, 0, 4, 4), v_(4, 1));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(0, 0, 4, 4), v_(1, -2));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(0, 0, 4, 4), v_(1, 4));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(image.asset, s(0, 0, 4, 4), v_(0, 0));
    sprite.draw(image.asset, s(4, 0, 4, 4), v_(0, 0));
    sprite.draw(image.asset, s(8, 0, 4, 4), v_(0, 0));
    sprite.draw(image.asset, s(12, 0, 4, 4), v_(0, 0));

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
    const sprite = new DrawSprite(canvas.canvas);
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

    // when
    sprite.draw(
      image.asset,
      s(0, 0, 4, 4),
      v_(0, 0),
      v_1_1_,
      BpxSpriteColorMapping.fromMapEntries([
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
