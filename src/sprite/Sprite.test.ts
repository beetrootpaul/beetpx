import { describe, expect, test } from "@jest/globals";
import { v_ } from "../misc/Vector2d";
import { spr_ } from "./Sprite";

describe("Sprite", () => {
  test("construction", () => {
    // given
    const sprite = spr_("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy).toEqual(v_(300, 4000));
    expect(sprite.size).toEqual(v_(1, 20));
  });

  test("normalization", () => {
    // given
    const sprite = spr_("any.image.url")(-1, -20, -300, -4000);

    // expect
    expect(sprite.xy).toEqual(v_(-301, -4020));
    expect(sprite.size).toEqual(v_(1, 20));
  });

  test("rounding", () => {
    // given
    const sprite = spr_("any.image.url")(1.4, -20.6, 300.2, -4000.8);

    // expect
    expect(sprite.xy).toEqual(v_(300, -4021));
    expect(sprite.size).toEqual(v_(2, 20));
  });

  test("clipping", () => {
    // given
    const originalSprite = spr_("any.image.url")(10, 200, 3000, 40000);

    // when
    const clippedSprite = originalSprite.clipBy(
      v_(3002, 40002),
      v_(3008, 40198),
    );

    // then
    expect(clippedSprite.xy).toEqual(v_(3002, 40002));
    expect(clippedSprite.size).toEqual(v_(6, 196));
    expect(originalSprite.xy).toEqual(v_(3000, 40000));
    expect(originalSprite.size).toEqual(v_(10, 200));
  });
});
