import { expect, test } from "vitest";
import { clamp } from "./clamp";

[
  // all values are same
  { params: [1, 1, 1], result: 1 },
  // all possible permutations of the order of min,mid,max
  { params: [1, 2, 3], result: 2 },
  { params: [1, 3, 2], result: 2 },
  { params: [2, 1, 3], result: 2 },
  { params: [2, 3, 1], result: 2 },
  { params: [3, 1, 2], result: 2 },
  { params: [3, 2, 1], result: 2 },
  // a negative case
  { params: [-999, -1000, -998], result: -999 },
  // a fractional case
  { params: [0.2, 0.3, 0.1], result: 0.2 },
].forEach(({ params, result }) => {
  test(`clamp(${params[0]},${params[1]},${params[2]})`, () => {
    expect(clamp(params[0]!, params[1]!, params[2]!)).toEqual(result);
  });
});

test("clamp", () => {
  expect(clamp(10, 20, 30)).toBe(20);
  expect(clamp(10, 9, 30)).toBe(10);
  expect(clamp(10, 31, 30)).toBe(30);

  expect(clamp(-1.3, -1.2, -1.1)).toBe(-1.2);
  expect(clamp(-1.3, -1.4, -1.1)).toBe(-1.3);
  expect(clamp(-1.3, -1.0, -1.1)).toBe(-1.1);

  expect(clamp(10, 30, 20)).toBe(20);
  expect(clamp(20, 10, 30)).toBe(20);
  expect(clamp(20, 30, 10)).toBe(20);
  expect(clamp(30, 10, 20)).toBe(20);
  expect(clamp(30, 20, 10)).toBe(20);

  expect(clamp(0, 0, 0)).toBe(0);
});
