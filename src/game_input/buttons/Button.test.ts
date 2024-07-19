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
    button.setRepeating({
      firstRepeatFrames: null,
      loopedRepeatFrames: null,
    });

    // initial state
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);

    // pressed
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(true);

    // still pressed
    range(999).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });

    // released
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(false);

    // still released
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(999).forEach(() => {
      button.update(false);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);

    // pressed and released again
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(true);
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(false);
  });

  test("#wasJustReleased / #wasJustPressed – with repeating", () => {
    const button = new Button();
    const firstRepeatFrames = 30;
    const loopedRepeatFrames = 20;
    button.setRepeating({ firstRepeatFrames, loopedRepeatFrames });

    // initial state
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);

    // first press
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(true);

    // nearly complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(firstRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(false);

    // back to first press
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(true);

    // complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(firstRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(true);

    // next, nearly complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(loopedRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(false);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(false);

    // back to first press
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(true);

    //  complete sequence of press x start frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(firstRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(true);

    // next, complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(loopedRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(true);

    // next, consecutive complete sequence of press x interval frames
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    range(loopedRepeatFrames - 1 - 2).forEach(() => {
      button.update(true);
      incrementFrameNumber();
      expect(button.wasJustReleased).toBe(false);
      expect(button.wasJustPressed).toBe(false);
    });
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(false);
    expect(button.wasJustPressed).toBe(false);
    button.update(true);
    incrementFrameNumber();
    expect(button.wasJustReleased).toBe(true);
    expect(button.wasJustPressed).toBe(true);
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}
