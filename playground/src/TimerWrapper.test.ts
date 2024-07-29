import { beforeEach, describe, expect, test, vi } from "vitest";
import { BeetPx } from "../../src";
import { TimerWrapper } from "./TimerWrapper";

describe("TimerWrapper", () => {
  let stubbedFrameNumber = 1;

  function incrementFrameNumber(): void {
    stubbedFrameNumber += 1;
  }

  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumberOutsidePause", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
  });

  test("should pass", () => {
    const tw = new TimerWrapper(10);
    expect(tw.t).toBe(0);

    incrementFrameNumber();
    expect(tw.t).toBe(1);
  });
});
