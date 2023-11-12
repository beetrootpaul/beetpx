import { describe, expect, test } from "@jest/globals";
import { BpxPattern } from "./Pattern";

describe("Pattern", () => {
  test("#hasPrimaryColorAt", () => {
    // given
    const pattern = BpxPattern.of(0b0101_1100_0101_0011);

    // then for the 1st row of 4 pixels
    expect(pattern.hasPrimaryColorAt(0, 0)).toBe(true);
    expect(pattern.hasPrimaryColorAt(1, 0)).toBe(false);
    expect(pattern.hasPrimaryColorAt(2, 0)).toBe(true);
    expect(pattern.hasPrimaryColorAt(3, 0)).toBe(false);

    // and for the 2nd row of 4 pixels
    expect(pattern.hasPrimaryColorAt(0, 1)).toBe(false);
    expect(pattern.hasPrimaryColorAt(1, 1)).toBe(false);
    expect(pattern.hasPrimaryColorAt(2, 1)).toBe(true);
    expect(pattern.hasPrimaryColorAt(3, 1)).toBe(true);

    // and for the 3rd row of 4 pixels
    expect(pattern.hasPrimaryColorAt(0, 2)).toBe(true);
    expect(pattern.hasPrimaryColorAt(1, 2)).toBe(false);
    expect(pattern.hasPrimaryColorAt(2, 2)).toBe(true);
    expect(pattern.hasPrimaryColorAt(3, 2)).toBe(false);

    // and for the 4th row of 4 pixels
    expect(pattern.hasPrimaryColorAt(0, 3)).toBe(true);
    expect(pattern.hasPrimaryColorAt(1, 3)).toBe(true);
    expect(pattern.hasPrimaryColorAt(2, 3)).toBe(false);
    expect(pattern.hasPrimaryColorAt(3, 3)).toBe(false);

    // and for positions outside the 4x4 grid
    expect(pattern.hasPrimaryColorAt(4, 0)).toBe(true);
    expect(pattern.hasPrimaryColorAt(5, 0)).toBe(false);
    expect(pattern.hasPrimaryColorAt(0, 4)).toBe(true);
    expect(pattern.hasPrimaryColorAt(0, 5)).toBe(false);
  });
});
