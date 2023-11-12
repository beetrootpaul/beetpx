import { describe, expect, test } from "@jest/globals";
import { spr_ } from "./Sprite";

describe("Sprite", () => {
  test("spr_", () => {
    // given
    const sprite = spr_("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy1.asArray()).toEqual([1, 20]);
    expect(sprite.xy2.asArray()).toEqual([301, 4020]);
    expect(sprite.size().asArray()).toEqual([300, 4000]);
  });
});
