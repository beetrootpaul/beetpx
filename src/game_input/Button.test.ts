import { describe, expect, test } from "@jest/globals";
import { Button } from "./Button";

describe("Button", () => {
  test("#wasJustPressed", () => {
    const button = new Button();

    button.update(false);

    expect(button.wasJustPressed).toBe(false);

    button.update(true);

    expect(button.wasJustPressed).toBe(true);

    button.update(true);
    button.update(true);
    button.update(true);

    expect(button.wasJustPressed).toBe(false);

    button.update(false);

    expect(button.wasJustPressed).toBe(false);

    button.update(true);

    expect(button.wasJustPressed).toBe(true);

    button.update(true);
    button.update(true);
    button.update(true);

    expect(button.wasJustPressed).toBe(false);
  });

  test("#wasJustReleased", () => {
    const button = new Button();

    button.update(false);

    expect(button.wasJustReleased).toBe(false);

    button.update(true);

    expect(button.wasJustReleased).toBe(false);

    button.update(false);

    expect(button.wasJustReleased).toBe(true);

    button.update(false);
    button.update(false);
    button.update(false);

    expect(button.wasJustReleased).toBe(false);

    button.update(true);

    expect(button.wasJustReleased).toBe(false);

    button.update(false);

    expect(button.wasJustReleased).toBe(true);

    button.update(false);
    button.update(false);
    button.update(false);

    expect(button.wasJustReleased).toBe(false);
  });
});
