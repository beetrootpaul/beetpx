import { describe, expect, test } from "@jest/globals";
import { Button } from "./Button";

describe("Button", () => {
  test("#wasJustReleased / #wasJustPressed – without repeating", () => {
    const anyDt = 123;
    const button = new Button();
    const wasJustReleased = () => button.wasJustReleased(false);
    const wasJustPressed = () => button.wasJustPressed(false);

    // initial state
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // pressed
    button.update(false, anyDt);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);
    button.update(true, anyDt);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);

    // still pressed
    button.update(
      true,
      Button.repeatingStartSeconds + Button.repeatingIntervalSeconds + anyDt,
    );
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // released
    button.update(false, anyDt);
    expect(wasJustReleased()).toBe(true);
    expect(wasJustPressed()).toBe(false);

    // still released
    button.update(
      false,
      Button.repeatingStartSeconds + Button.repeatingIntervalSeconds + anyDt,
    );
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(false);

    // pressed and released again
    button.update(true, anyDt);
    expect(wasJustReleased()).toBe(false);
    expect(wasJustPressed()).toBe(true);
    button.update(false, anyDt);
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
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // nearly complete sequence of press x start frames
    button.update(true, Button.repeatingStartSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(false, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    // complete sequence of press x start frames
    button.update(true, Button.repeatingStartSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, nearly complete sequence of press x interval frames
    button.update(true, Button.repeatingIntervalSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(false, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(false);

    // back to first press
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(true);

    //  complete sequence of press x start frames
    button.update(true, Button.repeatingStartSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, complete sequence of press x interval frames
    button.update(true, Button.repeatingIntervalSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);

    // next, consecutive complete sequence of press x interval frames
    button.update(true, Button.repeatingIntervalSeconds - 0.001);
    expect(wasJustReleasedRepeating()).toBe(false);
    expect(wasJustPressedRepeating()).toBe(false);
    button.update(true, 0.001);
    expect(wasJustReleasedRepeating()).toBe(true);
    expect(wasJustPressedRepeating()).toBe(true);
  });
});
