import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../../BeetPx";
import { v_ } from "../../misc/Vector2d";
import { GameButtons } from "./GameButtons";

describe("GameButtons", () => {
  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
  });

  test("#getPressedDirection", () => {
    const buttons = new GameButtons();

    buttons.update(new Set(["button_left"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(-1, 0));
    buttons.update(new Set(["button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(1, 0));
    buttons.update(new Set(["button_up"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, -1));
    buttons.update(new Set(["button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 1));

    buttons.update(new Set([]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));

    buttons.update(new Set(["button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));
    buttons.update(new Set(["button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));

    buttons.update(new Set(["button_left", "button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(-1, 0));
    buttons.update(new Set(["button_right", "button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(1, 0));
    buttons.update(new Set(["button_up", "button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, -1));
    buttons.update(new Set(["button_down", "button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 1));

    buttons.update(
      new Set(["button_left", "button_right", "button_up", "button_down"]),
    );
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual(v_(0, 0));
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}
