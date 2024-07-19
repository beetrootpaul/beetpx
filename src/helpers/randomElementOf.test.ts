import { expect, test } from "vitest";
import { randomElementOf } from "./randomElementOf";
import { range } from "./range";
import { throwError } from "./throwError";

test("randomElementOf", () => {
  expect(randomElementOf([])).toBeUndefined();

  expect(randomElementOf([123])).toEqual(123);

  const expectedSamplesPerElement = 100;
  const elements = [0, 1, 2];
  const results = elements.map(() => 0);
  range(elements.length * expectedSamplesPerElement).forEach(() => {
    const pickedElement =
      randomElementOf(elements) ?? throwError("element should be defined");
    results[pickedElement]! += 1;
  });
  const acceptedDiff = 0.3 * expectedSamplesPerElement;
  expect(results[0]).toBeGreaterThanOrEqual(
    expectedSamplesPerElement - acceptedDiff,
  );
  expect(results[0]).toBeLessThanOrEqual(
    expectedSamplesPerElement + acceptedDiff,
  );
  expect(results[1]).toBeGreaterThanOrEqual(
    expectedSamplesPerElement - acceptedDiff,
  );
  expect(results[1]).toBeLessThanOrEqual(
    expectedSamplesPerElement + acceptedDiff,
  );
  expect(results[2]).toBeGreaterThanOrEqual(
    expectedSamplesPerElement - acceptedDiff,
  );
  expect(results[2]).toBeLessThanOrEqual(
    expectedSamplesPerElement + acceptedDiff,
  );
});
