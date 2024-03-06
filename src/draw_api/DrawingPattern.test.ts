import { describe, expect, test } from "@jest/globals";
import { BpxDrawingPattern } from "./DrawingPattern";

describe("Pattern", () => {
  [
    { bits: 0b0000_0000_0000_0000, ascii: "----\n----\n----\n----" },
    { bits: 0b0000_0000_0000_0001, ascii: "----\n----\n----\n---#" },
    { bits: 0b1000_0000_0000_0000, ascii: "#---\n----\n----\n----" },
    { bits: 0b0000_1111_0011_0101, ascii: "----\n####\n--##\n-#-#" },
    { bits: 0b1010_1001_1100_1000, ascii: "#-#-\n#--#\n##--\n#---" },
    { bits: 0b0111_1111_1111_1111, ascii: "-###\n####\n####\n####" },
    { bits: 0b1111_1111_1111_1110, ascii: "####\n####\n####\n###-" },
    { bits: 0b1111_1111_1111_1111, ascii: "####\n####\n####\n####" },
  ].forEach(({ bits, ascii }) => {
    test(`from ascii (case: ${ascii})`, () => {
      expectPatternsToBeSame(
        BpxDrawingPattern.of(bits),
        BpxDrawingPattern.from(ascii),
      );
    });
  });

  test("#hasPrimaryColorAt", () => {
    // given
    const pattern = BpxDrawingPattern.from(`
      #-#-
      --##
      #-#-
      ##--
    `);

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

  test("bits validation", () => {
    expect(() => BpxDrawingPattern.of(0b1_1111_1111_1111_1111)).toThrow();
    expect(() => BpxDrawingPattern.of(-0b0000_0000_0000_0001)).toThrow();
  });

  test("ascii parsing", () => {
    // empty
    expect(() => BpxDrawingPattern.from("")).toThrow();
    expect(() => BpxDrawingPattern.from("              ")).toThrow();
    expect(() => BpxDrawingPattern.from("  \n  \n  \n  ")).toThrow();
    // wrong amount of rows
    expect(() => BpxDrawingPattern.from("####\n####\n####")).toThrow();
    expect(() =>
      BpxDrawingPattern.from("####\n####\n####\n####\n####"),
    ).toThrow();
    // wrong amount of columns
    expect(() => BpxDrawingPattern.from("###\n####\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n###\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n####\n###\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n####\n####\n###")).toThrow();
    expect(() => BpxDrawingPattern.from("#####\n####\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n#####\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n####\n#####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n####\n####\n#####")).toThrow();
    // unexpected characters
    expect(() => BpxDrawingPattern.from("####\n###_#\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n###+#\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n###|#\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n###0#\n####\n####")).toThrow();
    expect(() => BpxDrawingPattern.from("####\n###1#\n####\n####")).toThrow();

    // a very sparse notation
    expectPatternsToBeSame(
      BpxDrawingPattern.from(
        "      \n      \n    -  -- #  \n\n\n\n    -- #  # \n -##   # \n    \n  \n ##     ##    \n    \n\n   ",
      ),
      BpxDrawingPattern.from("---#\n--##\n-###\n####"),
    );

    // unexpected characters
    expectPatternsToBeSame(
      BpxDrawingPattern.from(
        "      \n      \n    -  -- #  \n\n\n\n    -- #  # \n -##   # \n    \n  \n ##     ##    \n    \n\n   ",
      ),
      BpxDrawingPattern.from("---#\n--##\n-###\n####"),
    );
  });
});

function expectPatternsToBeSame(
  pattern1: BpxDrawingPattern,
  pattern2: BpxDrawingPattern,
) {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      expect(pattern1.hasPrimaryColorAt(x, y)).toEqual(
        pattern2.hasPrimaryColorAt(x, y),
      );
    }
  }
}
