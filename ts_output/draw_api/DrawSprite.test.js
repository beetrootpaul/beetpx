"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const Sprite_1 = require("../Sprite");
const Vector2d_1 = require("../Vector2d");
const DrawSprite_1 = require("./DrawSprite");
const TestCanvas_1 = require("./TestCanvas");
const TestImage_1 = require("./TestImage");
// TODO: tests for fill pattern
(0, globals_1.describe)("DrawSprite", () => {
    const ct = Color_1.transparent_;
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    const c2 = Color_1.SolidColor.fromRgbCssHex("#212223");
    const c3 = Color_1.SolidColor.fromRgbCssHex("#313233");
    const c4 = Color_1.SolidColor.fromRgbCssHex("#414243");
    const c5 = Color_1.SolidColor.fromRgbCssHex("#515253");
    (0, globals_1.test)("1x1 image", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1 },
            image: `
        #
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 1, 1), (0, Vector2d_1.v_)(1, 1), new Map());
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
    (0, globals_1.test)("image with multiple colors", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(9, 6, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # # # # #
        # : % : =
        = = = = =
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 5, 3), (0, Vector2d_1.v_)(3, 2), new Map());
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
    (0, globals_1.test)("a sprite from a bigger image", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(5, 4, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(1, 1, 3, 3), (0, Vector2d_1.v_)(2, 1), new Map());
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
    (0, globals_1.test)("a 0-size sprite", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(5, 4, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(1, 1, 1, 1), (0, Vector2d_1.v_)(2, 1), new Map());
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
    (0, globals_1.test)("a negative size sprite", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(5, 4, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(3, 3, 1, 1), (0, Vector2d_1.v_)(2, 1), new Map());
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
    (0, globals_1.test)("sprite vs source image clipping: left edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(8, 8, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(-2, 1, 2, 3), (0, Vector2d_1.v_)(3, 3), new Map());
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
    (0, globals_1.test)("sprite vs source image clipping: right edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(8, 8, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(2, 1, 6, 3), (0, Vector2d_1.v_)(3, 3), new Map());
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
    (0, globals_1.test)("sprite vs source image clipping: top edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(8, 8, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(1, -2, 3, 2), (0, Vector2d_1.v_)(3, 3), new Map());
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
    (0, globals_1.test)("sprite vs source image clipping: bottom edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(8, 8, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(1, 2, 3, 6), (0, Vector2d_1.v_)(3, 3), new Map());
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
    (0, globals_1.test)("sprite vs canvas clipping: left edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(-2, 1), new Map());
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
    (0, globals_1.test)("sprite vs canvas clipping: right edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(4, 1), new Map());
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
    (0, globals_1.test)("sprite vs canvas clipping: top edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(1, -2), new Map());
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
    (0, globals_1.test)("sprite vs canvas clipping: bottom edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(1, 4), new Map());
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
    (0, globals_1.test)("transparency", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": ct },
            image: `
        # # # # : . . : . % . . = . . =
        # . . # . . . . % . . . . = = .
        # . . # . . . . . . . % = . . =
        # # # # : . . : . . % . . = = .
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(0, 0), new Map());
        sprite.draw(image.asset, (0, Sprite_1.spr_)(4, 0, 8, 4), (0, Vector2d_1.v_)(0, 0), new Map());
        sprite.draw(image.asset, (0, Sprite_1.spr_)(8, 0, 12, 4), (0, Vector2d_1.v_)(0, 0), new Map());
        sprite.draw(image.asset, (0, Sprite_1.spr_)(12, 0, 16, 4), (0, Vector2d_1.v_)(0, 0), new Map());
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
    (0, globals_1.test)("color mapping", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
        const sprite = new DrawSprite_1.DrawSprite(canvas.bytes, canvas.size);
        const image = new TestImage_1.TestImage({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, ".": ct },
            image: `
        : # # :
        % . . %
        : % % :
        # . . #
      `,
        });
        // when
        sprite.draw(image.asset, (0, Sprite_1.spr_)(0, 0, 4, 4), (0, Vector2d_1.v_)(0, 0), new Map([
            [c1.id(), c4],
            [c2.id(), c5],
            [c3.id(), ct],
        ]));
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
