import { describe, expect, test } from "@jest/globals";
import { v_ } from "../../misc/Vector2d";
import { Buttons } from "./Buttons";

describe("Buttons", () => {
  test("#getPressedDirection", () => {
    const buttons = new Buttons();

    buttons.update(new Set(["button_left"]));
    expect(buttons.getPressedDirection()).toEqual(v_(-1, 0));
    buttons.update(new Set(["button_right"]));
    expect(buttons.getPressedDirection()).toEqual(v_(1, 0));
    buttons.update(new Set(["button_up"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, -1));
    buttons.update(new Set(["button_down"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, 1));

    buttons.update(new Set([]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));

    buttons.update(new Set(["button_left", "button_right"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));
    buttons.update(new Set(["button_up", "button_down"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));

    buttons.update(new Set(["button_left", "button_up", "button_down"]));
    expect(buttons.getPressedDirection()).toEqual(v_(-1, 0));
    buttons.update(new Set(["button_right", "button_up", "button_down"]));
    expect(buttons.getPressedDirection()).toEqual(v_(1, 0));
    buttons.update(new Set(["button_up", "button_left", "button_right"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, -1));
    buttons.update(new Set(["button_down", "button_left", "button_right"]));
    expect(buttons.getPressedDirection()).toEqual(v_(0, 1));

    buttons.update(
      new Set(["button_left", "button_right", "button_up", "button_down"]),
    );
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));
  });
});
