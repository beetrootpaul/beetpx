import { expect, test, vi } from "vitest";
import { BeetPx } from "../BeetPx";
import { booleanChangingEveryNthFrame } from "./booleanChangingEveryNthFrame";
import { range } from "./range";

test.each(["pause", "ignore"] as const)(
  "booleanChangingEveryNthFrame (onGamePause: %s)",
  onGamePause => {
    function nextFrameNumberWillBe(frameNumber: number): void {
      vi.spyOn(
        BeetPx,
        onGamePause === "pause" ? "frameNumberOutsidePause" : "frameNumber",
        "get",
      ).mockImplementation(() => frameNumber);
    }
    const opts = { onGamePause };

    range(10).forEach(frame => {
      nextFrameNumberWillBe(frame);
      expect(booleanChangingEveryNthFrame(10, opts)).toBe(true);
    });
    range(10).forEach(frame => {
      nextFrameNumberWillBe(10 + frame);
      expect(booleanChangingEveryNthFrame(10, opts)).toBe(false);
    });
    range(10).forEach(frame => {
      nextFrameNumberWillBe(20 + frame);
      expect(booleanChangingEveryNthFrame(10, opts)).toBe(true);
    });
    range(10).forEach(frame => {
      nextFrameNumberWillBe(30 + frame);
      expect(booleanChangingEveryNthFrame(10, opts)).toBe(false);
    });

    nextFrameNumberWillBe(0);
    expect(booleanChangingEveryNthFrame(1, opts)).toBe(true);
    expect(booleanChangingEveryNthFrame(2, opts)).toBe(true);
    nextFrameNumberWillBe(1);
    expect(booleanChangingEveryNthFrame(1, opts)).toBe(false);
    expect(booleanChangingEveryNthFrame(2, opts)).toBe(true);
    nextFrameNumberWillBe(2);
    expect(booleanChangingEveryNthFrame(1, opts)).toBe(true);
    expect(booleanChangingEveryNthFrame(2, opts)).toBe(false);

    nextFrameNumberWillBe(0);
    expect(booleanChangingEveryNthFrame(0.7, opts)).toBe(true);
    nextFrameNumberWillBe(1);
    expect(booleanChangingEveryNthFrame(0.7, opts)).toBe(false);
    nextFrameNumberWillBe(2);
    expect(booleanChangingEveryNthFrame(0.7, opts)).toBe(true);
    nextFrameNumberWillBe(3);
    expect(booleanChangingEveryNthFrame(0.7, opts)).toBe(true);
    nextFrameNumberWillBe(4);
    expect(booleanChangingEveryNthFrame(0.7, opts)).toBe(false);

    nextFrameNumberWillBe(987);
    expect(booleanChangingEveryNthFrame(0, opts)).toBe(true);
    expect(booleanChangingEveryNthFrame(-0.123, opts)).toBe(true);
    expect(booleanChangingEveryNthFrame(-123, opts)).toBe(true);
  },
);
