import { describe, expect, test } from "@jest/globals";
import { BpxUtils } from "./Utils";

describe("Utils", () => {
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
    test(`#clamp(${params[0]},${params[1]},${params[2]})`, () => {
      expect(BpxUtils.clamp(params[0]!, params[1]!, params[2]!)).toEqual(
        result,
      );
    });
  });

  test(`#randomElementOf`, () => {
    expect(BpxUtils.randomElementOf([])).toBeUndefined();

    expect(BpxUtils.randomElementOf([123])).toEqual(123);

    const expectedSamplesPerElement = 100;
    const elements = [0, 1, 2];
    const results = elements.map(() => 0);
    BpxUtils.repeatN(elements.length * expectedSamplesPerElement, () => {
      const pickedElement =
        BpxUtils.randomElementOf(elements) ??
        BpxUtils.throwError("element should be defined");
      results[pickedElement] += 1;
    });
    const acceptedDiff = 0.25 * expectedSamplesPerElement;
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
});
