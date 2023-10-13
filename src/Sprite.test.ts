import { describe, expect, test } from "@jest/globals";
import { spr_ } from "./Sprite";

describe("Sprite", () => {
  test("spr_", () => {
    // given
    const sprite = spr_("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy1[0]).toEqual(1);
    expect(sprite.xy1[1]).toEqual(20);
    expect(sprite.xy2[0]).toEqual(301);
    expect(sprite.xy2[1]).toEqual(4020);
    expect(sprite.size()[0]).toEqual(300);
    expect(sprite.size()[1]).toEqual(4000);
  });
});
