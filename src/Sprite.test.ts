import { describe, expect, test } from "@jest/globals";
import { spr_ } from "./Sprite";

describe("Sprite", () => {
  test("spr_", () => {
    // given
    const sprite = spr_("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy1.x).toEqual(1);
    expect(sprite.xy1.y).toEqual(20);
    expect(sprite.xy2.x).toEqual(301);
    expect(sprite.xy2.y).toEqual(4020);
    expect(sprite.size().x).toEqual(300);
    expect(sprite.size().y).toEqual(4000);
  });
});
