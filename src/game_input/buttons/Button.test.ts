import { beforeEach, describe, expect, test, vi } from "vitest";
import { BeetPx } from "../../BeetPx";
import { range } from "../../utils/range";

import { Button } from "./Button";

describe("Button", () => {
  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumber", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
  });

  test("#wasJustReleased / #wasJustPressed – without repeating", () => {
    const button = new Button();
    const wasJustReleased = () => button.wasJustReleased(false);
    const wasJustPressed = () => button.wasJustPressed(false);

    // initial state
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // pressed
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);

    // still pressed
    range(
      Button.repeatingFramesStart + Button.repeatingFramesInterval + 1,
    ).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleased()).toBe(false);
      expect(wasJustPressed()).toBe(false);
    });

    // released
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(true);
    expect(wasJustPressed()).toBe(false);

    // still released
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);
    range(
      Button.repeatingFramesStart + Button.repeatingFramesInterval + 1 - 2,
    ).forEach(() => {
      button.update(false);
      incrementFrameNumber();
      expect(wasJustReleased()).toBe(false);
      expect(wasJustPressed()).toBe(false);
    });
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // pressed and released again
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleased()).toBe(true);
    expect(wasJustPressed()).toBe(false);
  });

  test("#wasJustReleased / #wasJustPressed – with repeating", () => {
    const button = new Button();
    const wasJustReleasedRepeating = () => button.wasJustReleased(true);
    const wasJustPressedRepeating = () => button.wasJustPressed(true);

    // initial state
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);

    // first press
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // nearly complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesStart - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesStart - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, nearly complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesInterval - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(false);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    //  complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesStart - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesInterval - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, consecutive complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    range(Button.repeatingFramesInterval - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}
