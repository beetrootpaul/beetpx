import { expect, test, vi } from "vitest";
import { BeetPx } from "../BeetPx";
import { booleanChangingEveryNthFrame } from "./booleanChangingEveryNthFrame";
import { range } from "./range";

test("booleanChangingEveryNthFrame", () => {
  range(10).forEach(frame => {
    nextFrameNumberWillBe(frame);
    expect(booleanChangingEveryNthFrame(10)).toBe(true);
  });
  range(10).forEach(frame => {
    nextFrameNumberWillBe(10 + frame);
    expect(booleanChangingEveryNthFrame(10)).toBe(false);
  });
  range(10).forEach(frame => {
    nextFrameNumberWillBe(20 + frame);
    expect(booleanChangingEveryNthFrame(10)).toBe(true);
  });
  range(10).forEach(frame => {
    nextFrameNumberWillBe(30 + frame);
    expect(booleanChangingEveryNthFrame(10)).toBe(false);
  });

  nextFrameNumberWillBe(0);
  expect(booleanChangingEveryNthFrame(1)).toBe(true);
  expect(booleanChangingEveryNthFrame(2)).toBe(true);
  nextFrameNumberWillBe(1);
  expect(booleanChangingEveryNthFrame(1)).toBe(false);
  expect(booleanChangingEveryNthFrame(2)).toBe(true);
  nextFrameNumberWillBe(2);
  expect(booleanChangingEveryNthFrame(1)).toBe(true);
  expect(booleanChangingEveryNthFrame(2)).toBe(false);

  nextFrameNumberWillBe(0);
  expect(booleanChangingEveryNthFrame(0.7)).toBe(true);
  nextFrameNumberWillBe(1);
  expect(booleanChangingEveryNthFrame(0.7)).toBe(false);
  nextFrameNumberWillBe(2);
  expect(booleanChangingEveryNthFrame(0.7)).toBe(true);
  nextFrameNumberWillBe(3);
  expect(booleanChangingEveryNthFrame(0.7)).toBe(true);
  nextFrameNumberWillBe(4);
  expect(booleanChangingEveryNthFrame(0.7)).toBe(false);

  nextFrameNumberWillBe(987);
  expect(booleanChangingEveryNthFrame(0)).toBe(true);
  expect(booleanChangingEveryNthFrame(-0.123)).toBe(true);
  expect(booleanChangingEveryNthFrame(-123)).toBe(true);
});

function nextFrameNumberWillBe(frameNumber: number): void {
  vi.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => frameNumber);
}
