import { describe, expect, test } from "@jest/globals";
import { v_ } from "../misc/Vector2d";
import { spr_ } from "./Sprite";

describe("Sprite", () => {
  test("spr_", () => {
    // given
    const sprite = spr_("any.image.url")(1, 20, 300, 4000);

    // expect
    expect(sprite.xy1).toEqual(v_(1, 20));
    expect(sprite.xy2).toEqual(v_(301, 4020));
    expect(sprite.size()).toEqual(v_(300, 4000));
  });
});
