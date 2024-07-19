import { expect, test } from "vitest";
import { trigCos } from "./trigCos";

test("trigCos", () => {
  expect(trigCos(0 / 8)).toBeCloseTo(1, 2);
  expect(trigCos(1 / 8)).toBeCloseTo(0.71, 2);
  expect(trigCos(2 / 8)).toBeCloseTo(0, 2);
  expect(trigCos(3 / 8)).toBeCloseTo(-0.71, 2);
  expect(trigCos(4 / 8)).toBeCloseTo(-1, 2);
  expect(trigCos(5 / 8)).toBeCloseTo(-0.71, 2);
  expect(trigCos(6 / 8)).toBeCloseTo(0, 2);
  expect(trigCos(7 / 8)).toBeCloseTo(0.71, 2);
});
