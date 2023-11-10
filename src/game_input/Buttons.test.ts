import { describe, expect, test } from "@jest/globals";
import { Buttons } from "./Buttons";

describe("Buttons", () => {
  test("#areDirectionsPressedAsVector", () => {
    const buttons = new Buttons();

    buttons.update(new Set(["button_left"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([-1, 0]);
    buttons.update(new Set(["button_right"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([1, 0]);
    buttons.update(new Set(["button_up"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, -1]);
    buttons.update(new Set(["button_down"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 1]);

    buttons.update(new Set([]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 0]);

    buttons.update(new Set(["button_left", "button_right"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 0]);
    buttons.update(new Set(["button_up", "button_down"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 0]);

    buttons.update(new Set(["button_left", "button_up", "button_down"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([-1, 0]);
    buttons.update(new Set(["button_right", "button_up", "button_down"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([1, 0]);
    buttons.update(new Set(["button_up", "button_left", "button_right"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, -1]);
    buttons.update(new Set(["button_down", "button_left", "button_right"]));
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 1]);

    buttons.update(
      new Set(["button_left", "button_right", "button_up", "button_down"]),
    );
    expect(buttons.areDirectionsPressedAsVector().asArray()).toEqual([0, 0]);
  });
});
