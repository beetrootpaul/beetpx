import { expect, test } from "vitest";
import { mod } from "./mod";

test("mod", () => {
  expect(mod(123.5, 1000)).toBe(123.5);
  expect(mod(1123.5, 1000)).toBe(123.5);
  expect(mod(123.5, 100)).toBe(23.5);
  expect(mod(123.5, 2)).toBe(1.5);
  expect(mod(123.5, 1)).toBe(0.5);

  expect(mod(-123.5, 1000)).toBe(876.5);
  expect(mod(-1123.5, 1000)).toBe(876.5);
  expect(mod(-123.5, 100)).toBe(76.5);
  expect(mod(-1123.5, 100)).toBe(76.5);
  expect(mod(-123.5, 2)).toBe(0.5);
  expect(mod(-123.5, 1)).toBe(0.5);

  expect(mod(123.5, 0)).toBe(0);

  expect(mod(123.5, -1)).toBe(-0.5);
  expect(mod(123.5, -2)).toBe(-0.5);
});
