import { describe, expect, test } from "vitest";
import { $spr, $v } from "../shorthands";

describe("Sprite", () => {
  test("construction", () => {
    // given
    const sprite = $spr("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy).toEqual($v(300, 4000));
    expect(sprite.size).toEqual($v(1, 20));
  });

  test("normalization", () => {
    // given
    const sprite = $spr("any.image.url")(-1, -20, -300, -4000);

    // expect
    expect(sprite.xy).toEqual($v(-301, -4020));
    expect(sprite.size).toEqual($v(1, 20));
  });

  test("rounding", () => {
    // given
    const sprite = $spr("any.image.url")(1.4, -20.6, 300.2, -4000.8);

    // expect
    expect(sprite.xy).toEqual($v(300, -4021));
    expect(sprite.size).toEqual($v(2, 20));
  });

  test("clipping", () => {
    // given
    const originalSprite = $spr("any.image.url")(10, 200, 3000, 40000);

    // when
    const clippedSprite = originalSprite.clipBy(
      $v(3002, 40002),
      $v(3008, 40198),
    );

    // then
    expect(clippedSprite.xy).toEqual($v(3002, 40002));
    expect(clippedSprite.size).toEqual($v(6, 196));
    expect(originalSprite.xy).toEqual($v(3000, 40000));
    expect(originalSprite.size).toEqual($v(10, 200));
  });
});
