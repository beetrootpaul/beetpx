import { beforeEach, describe, expect, test, vi } from "vitest";
import { $v_0_0, $v_0_1, $v_1_0, BeetPx } from "../../";
import { GameButtons } from "./GameButtons";

describe("GameButtons", () => {
  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumber", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
  });

  test("#getPressedDirection", () => {
    const buttons = new GameButtons();

    buttons.update(new Set(["button_left"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_1_0.neg());
    buttons.update(new Set(["button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_1_0);
    buttons.update(new Set(["button_up"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_1.neg());
    buttons.update(new Set(["button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_1);

    buttons.update(new Set([]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_0);

    buttons.update(new Set(["button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_0);
    buttons.update(new Set(["button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_0);

    buttons.update(new Set(["button_left", "button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_1_0.neg());
    buttons.update(new Set(["button_right", "button_up", "button_down"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_1_0);
    buttons.update(new Set(["button_up", "button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_1.neg());
    buttons.update(new Set(["button_down", "button_left", "button_right"]));
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_1);

    buttons.update(
      new Set(["button_left", "button_right", "button_up", "button_down"]),
    );
    incrementFrameNumber();
    expect(buttons.getPressedDirection()).toEqual($v_0_0);
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}
