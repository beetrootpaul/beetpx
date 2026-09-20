import { expect, test } from "vitest";
import { trigSin } from "./trigSin";

test("trigSin", () => {
  expect(trigSin(0 / 8)).toBeCloseTo(0, 2);
  expect(trigSin(1 / 8)).toBeCloseTo(0.71, 2);
  expect(trigSin(2 / 8)).toBeCloseTo(1, 2);
  expect(trigSin(3 / 8)).toBeCloseTo(0.71, 2);
  expect(trigSin(4 / 8)).toBeCloseTo(0, 2);
  expect(trigSin(5 / 8)).toBeCloseTo(-0.71, 2);
  expect(trigSin(6 / 8)).toBeCloseTo(-1, 2);
  expect(trigSin(7 / 8)).toBeCloseTo(-0.71, 2);
});
