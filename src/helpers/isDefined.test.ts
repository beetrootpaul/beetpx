import { expect, test } from "vitest";
import { isDefined } from "./isDefined";

test("isDefined", () => {
  expect(isDefined(true)).toBe(true);
  expect(isDefined(false)).toBe(true);
  expect(isDefined(0)).toBe(true);
  expect(isDefined(123)).toBe(true);
  expect(isDefined("")).toBe(true);
  expect(isDefined("abc")).toBe(true);
  expect(isDefined([])).toBe(true);
  expect(isDefined({})).toBe(true);

  expect(isDefined(undefined)).toBe(false);
  expect(isDefined(null)).toBe(false);
});
