import { describe, expect, test } from "vitest";
import { TimerWrapper } from "./TimerWrapper";
import { incrementFrameNumber } from "./test-setup/stub-frame-number";

describe("TimerWrapper", () => {
  test("should pass", () => {
    const tw = new TimerWrapper(10);
    expect(tw.t).toBe(0);

    incrementFrameNumber();
    expect(tw.t).toBe(1);
  });
});
