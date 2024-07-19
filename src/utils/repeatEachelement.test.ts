import { expect, test } from "vitest";
import { repeatEachElement } from "./repeatEachElement";

test("repeatEachElement", () => {
  expect(repeatEachElement(1, [3, 2, 1])).toEqual([3, 2, 1]);
  expect(repeatEachElement(2, [3, 2, 1])).toEqual([3, 3, 2, 2, 1, 1]);
  expect(repeatEachElement(3, [3, 2, 1])).toEqual([3, 3, 3, 2, 2, 2, 1, 1, 1]);

  expect(repeatEachElement(2, [3, 3, 2, 1, 1])).toEqual([
    3, 3, 3, 3, 2, 2, 1, 1, 1, 1,
  ]);

  expect(repeatEachElement(0, [3, 2, 1])).toEqual([]);
  expect(repeatEachElement(-1, [3, 2, 1])).toEqual([]);
  expect(repeatEachElement(-1.1, [3, 2, 1])).toEqual([]);
  expect(repeatEachElement(-99.99, [3, 2, 1])).toEqual([]);

  expect(repeatEachElement(0.4, [3, 2, 1])).toEqual([]);
  expect(repeatEachElement(0.6, [3, 2, 1])).toEqual([3, 2, 1]);
  expect(repeatEachElement(2.4, [3, 2, 1])).toEqual([3, 3, 2, 2, 1, 1]);
  expect(repeatEachElement(2.6, [3, 2, 1])).toEqual([
    3, 3, 3, 2, 2, 2, 1, 1, 1,
  ]);
});
