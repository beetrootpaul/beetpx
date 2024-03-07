import { expect, test } from "vitest";
import { lerp } from "./lerp";

test("lerp", () => {
  expect(lerp(100, 200, -0.1)).toBe(90);
  expect(lerp(100, 200, 0)).toBe(100);
  expect(lerp(100, 200, 0.1)).toBe(110);
  expect(lerp(100, 200, 0.9)).toBe(190);
  expect(lerp(100, 200, 1)).toBe(200);
  expect(lerp(100, 200, 1.1)).toBe(210);

  expect(lerp(200, 100, 0)).toBe(200);
  expect(lerp(200, 100, 1)).toBe(100);

  expect(lerp(100, 200, -0.1, { clamp: true })).toBe(100);
  expect(lerp(100, 200, 1.1, { clamp: true })).toBe(200);
  expect(lerp(200, 100, -0.1, { clamp: true })).toBe(200);
  expect(lerp(200, 100, 1.1, { clamp: true })).toBe(100);
});
