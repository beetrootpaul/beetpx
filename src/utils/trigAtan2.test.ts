import { expect, test } from "vitest";
import { trigAtan2 } from "./trigAtan2";

test("trigAtan2", () => {
  expect(trigAtan2(12.3, 0)).toEqual(0 / 8);
  expect(trigAtan2(12.3, 12.3)).toEqual(1 / 8);
  expect(trigAtan2(0, 12.3)).toEqual(2 / 8);
  expect(trigAtan2(-12.3, 12.3)).toEqual(3 / 8);
  expect(trigAtan2(-12.3, 0)).toEqual(4 / 8);
  expect(trigAtan2(-12.3, -12.3)).toEqual(5 / 8);
  expect(trigAtan2(0, -12.3)).toEqual(6 / 8);
  expect(trigAtan2(12.3, -12.3)).toEqual(7 / 8);
});
