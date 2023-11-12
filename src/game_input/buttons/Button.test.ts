import { describe, expect, test } from "@jest/globals";
import { u_ } from "../../Utils";
import { Button } from "./Button";

describe("Button", () => {
  test("#wasJustReleased / #wasJustPressed – without repeating", () => {
    const button = new Button();
    const wasJustReleased = () => button.wasJustReleased(false);
    const wasJustPressed = () => button.wasJustPressed(false);

    // initial state
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // pressed
    button.update(false);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);
    button.update(true);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);

    // still pressed
    u_.range(
      Button.repeatingFramesStart + Button.repeatingFramesInterval + 1,
    ).forEach(() => {
      button.update(true);
      expect(wasJustReleased()).toBe(false);
      expect(wasJustPressed()).toBe(false);
    });

    // released
    button.update(false);
    expect(wasJustReleased()).toBe(true);
    expect(wasJustPressed()).toBe(false);

    // still released
    u_.range(
      Button.repeatingFramesStart + Button.repeatingFramesInterval + 1,
    ).forEach(() => {
      button.update(false);
      expect(wasJustReleased()).toBe(false);
      expect(wasJustPressed()).toBe(false);
    });

    // pressed and released again
    button.update(true);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);
    button.update(false);
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
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // nearly complete sequence of press x start frames
    u_.range(Button.repeatingFramesStart - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(false);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // complete sequence of press x start frames
    u_.range(Button.repeatingFramesStart - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, nearly complete sequence of press x interval frames
    u_.range(Button.repeatingFramesInterval - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(false);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    //  complete sequence of press x start frames
    u_.range(Button.repeatingFramesStart - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, complete sequence of press x interval frames
    u_.range(Button.repeatingFramesInterval - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, consecutive complete sequence of press x interval frames
    u_.range(Button.repeatingFramesInterval - 1).forEach(() => {
      button.update(true);
      expect(wasJustReleasedRepeating()).toBe(false);
      expect(wasJustPressedRepeating()).toBe(false);
    });
    button.update(true);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);
  });
});
