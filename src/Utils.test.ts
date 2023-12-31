import { describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "./BeetPx";
import { BpxUtils, u_ } from "./Utils";
import { BpxPixels } from "./draw_api/Pixels";
import { BpxCharSprite, BpxFont } from "./font/Font";
import { v_, v_0_0_ } from "./misc/Vector2d";

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

  test("#booleanChangingEveryNthFrame", () => {
    BpxUtils.range(10).forEach((frameNumber) => {
      jest
        .spyOn(BeetPx, "frameNumber", "get")
        .mockImplementation(() => frameNumber);
      expect(BpxUtils.booleanChangingEveryNthFrame(10)).toBe(true);
    });
    BpxUtils.range(10).forEach((frameNumber) => {
      jest
        .spyOn(BeetPx, "frameNumber", "get")
        .mockImplementation(() => 10 + frameNumber);
      expect(BpxUtils.booleanChangingEveryNthFrame(10)).toBe(false);
    });
    BpxUtils.range(10).forEach((frameNumber) => {
      jest
        .spyOn(BeetPx, "frameNumber", "get")
        .mockImplementation(() => 20 + frameNumber);
      expect(BpxUtils.booleanChangingEveryNthFrame(10)).toBe(true);
    });
    BpxUtils.range(10).forEach((frameNumber) => {
      jest
        .spyOn(BeetPx, "frameNumber", "get")
        .mockImplementation(() => 30 + frameNumber);
      expect(BpxUtils.booleanChangingEveryNthFrame(10)).toBe(false);
    });

    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 0);
    expect(BpxUtils.booleanChangingEveryNthFrame(1)).toBe(true);
    expect(BpxUtils.booleanChangingEveryNthFrame(2)).toBe(true);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 1);
    expect(BpxUtils.booleanChangingEveryNthFrame(1)).toBe(false);
    expect(BpxUtils.booleanChangingEveryNthFrame(2)).toBe(true);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 2);
    expect(BpxUtils.booleanChangingEveryNthFrame(1)).toBe(true);
    expect(BpxUtils.booleanChangingEveryNthFrame(2)).toBe(false);

    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 0);
    expect(BpxUtils.booleanChangingEveryNthFrame(0.7)).toBe(true);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 1);
    expect(BpxUtils.booleanChangingEveryNthFrame(0.7)).toBe(false);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 2);
    expect(BpxUtils.booleanChangingEveryNthFrame(0.7)).toBe(true);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 3);
    expect(BpxUtils.booleanChangingEveryNthFrame(0.7)).toBe(true);
    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 4);
    expect(BpxUtils.booleanChangingEveryNthFrame(0.7)).toBe(false);

    jest.spyOn(BeetPx, "frameNumber", "get").mockImplementation(() => 987);
    expect(BpxUtils.booleanChangingEveryNthFrame(0)).toBe(true);
    expect(BpxUtils.booleanChangingEveryNthFrame(-0.123)).toBe(true);
    expect(BpxUtils.booleanChangingEveryNthFrame(-123)).toBe(true);
  });

  test("#clamp", () => {
    expect(BpxUtils.clamp(10, 20, 30)).toBe(20);
    expect(BpxUtils.clamp(10, 9, 30)).toBe(10);
    expect(BpxUtils.clamp(10, 31, 30)).toBe(30);

    expect(BpxUtils.clamp(-1.3, -1.2, -1.1)).toBe(-1.2);
    expect(BpxUtils.clamp(-1.3, -1.4, -1.1)).toBe(-1.3);
    expect(BpxUtils.clamp(-1.3, -1.0, -1.1)).toBe(-1.1);

    expect(BpxUtils.clamp(10, 30, 20)).toBe(20);
    expect(BpxUtils.clamp(20, 10, 30)).toBe(20);
    expect(BpxUtils.clamp(20, 30, 10)).toBe(20);
    expect(BpxUtils.clamp(30, 10, 20)).toBe(20);
    expect(BpxUtils.clamp(30, 20, 10)).toBe(20);

    expect(BpxUtils.clamp(0, 0, 0)).toBe(0);
  });

  test("#isDefined", () => {
    expect(BpxUtils.isDefined(true)).toBe(true);
    expect(BpxUtils.isDefined(false)).toBe(true);
    expect(BpxUtils.isDefined(0)).toBe(true);
    expect(BpxUtils.isDefined(123)).toBe(true);
    expect(BpxUtils.isDefined("")).toBe(true);
    expect(BpxUtils.isDefined("abc")).toBe(true);
    expect(BpxUtils.isDefined([])).toBe(true);
    expect(BpxUtils.isDefined({})).toBe(true);

    expect(BpxUtils.isDefined(undefined)).toBe(false);
    expect(BpxUtils.isDefined(null)).toBe(false);
  });

  test("#lerp", () => {
    expect(BpxUtils.lerp(100, 200, -0.1)).toBe(90);
    expect(BpxUtils.lerp(100, 200, 0)).toBe(100);
    expect(BpxUtils.lerp(100, 200, 0.1)).toBe(110);
    expect(BpxUtils.lerp(100, 200, 0.9)).toBe(190);
    expect(BpxUtils.lerp(100, 200, 1)).toBe(200);
    expect(BpxUtils.lerp(100, 200, 1.1)).toBe(210);

    expect(BpxUtils.lerp(200, 100, 0)).toBe(200);
    expect(BpxUtils.lerp(200, 100, 1)).toBe(100);
  });

  test("#measureText", () => {
    jest.spyOn(BeetPx, "getFont").mockImplementation(
      () =>
        new (class implements BpxFont {
          id = "test-font";
          imageUrl = "any.image/url";
          spritesFor(text: string): BpxCharSprite[] {
            const sprites: BpxCharSprite[] = [];
            let positionInText = v_0_0_;
            for (let i = 0; i < text.length; i += 1) {
              //
              // data for test assertions where chars are tiny and jumps are huge
              //
              if (text[i] === ".") {
                sprites.push({
                  char: ".",
                  positionInText,
                  type: "pixels",
                  // pixels of a size 1 x 2
                  pixels: BpxPixels.from("-\n#"),
                });
                positionInText = positionInText.add(100, -200);
              }
              if (text[i] === "o") {
                sprites.push({
                  char: "o",
                  positionInText,
                  type: "image",
                  spriteXyWh: [v_(50_000, 60_000), v_(30, 40)],
                });
                positionInText = positionInText.add(-3_000, 4_000);
              }
              //
              // data for test assertions where chars are huge and jumps are tiny
              //
              if (text[i] === "x") {
                sprites.push({
                  char: "x",
                  positionInText,
                  type: "pixels",
                  // pixels of a size 100 x 200
                  pixels: BpxPixels.from(
                    u_
                      .range(200)
                      .map(
                        (_) => "-".repeat(25) + "#".repeat(50) + "-".repeat(25),
                      )
                      .join("\n"),
                  ),
                });
                positionInText = positionInText.add(1, -2);
              }
              if (text[i] === "#") {
                sprites.push({
                  char: "#",
                  positionInText,
                  type: "image",
                  spriteXyWh: [v_(50_000, 60_000), v_(3_000, 4_000)],
                });
                positionInText = positionInText.add(-30, 40);
              }
            }
            return sprites;
          }
        })(),
    );

    //
    // assertions where chars are tiny and jumps are huge
    //
    expect(BpxUtils.measureText(".")).toEqual([v_(0, 0), v_(1, 2)]);
    expect(BpxUtils.measureText("o")).toEqual([v_(0, 0), v_(30, 40)]);
    expect(BpxUtils.measureText("...")).toEqual([v_(0, -400), v_(201, 402)]);
    expect(BpxUtils.measureText("ooo")).toEqual([
      v_(-6_000, 0),
      v_(6_030, 8_040),
    ]);
    expect(BpxUtils.measureText(".o.o.o")).toEqual([
      v_(-5_800, -200),
      v_(5_930, 7_802),
    ]);

    //
    // assertions where chars are huge and jumps are tiny
    //
    expect(BpxUtils.measureText("x")).toEqual([v_(0, 0), v_(100, 200)]);
    expect(BpxUtils.measureText("#")).toEqual([v_(0, 0), v_(3_000, 4_000)]);
    expect(BpxUtils.measureText("xxx")).toEqual([v_(0, -4), v_(102, 204)]);
    expect(BpxUtils.measureText("###")).toEqual([v_(-60, 0), v_(3_060, 4_080)]);
    expect(BpxUtils.measureText("x#x#x#")).toEqual([
      v_(-58, -2),
      v_(3_059, 4_076),
    ]);
  });

  test("#mod", () => {
    expect(BpxUtils.mod(123.5, 1000)).toBe(123.5);
    expect(BpxUtils.mod(1123.5, 1000)).toBe(123.5);
    expect(BpxUtils.mod(123.5, 100)).toBe(23.5);
    expect(BpxUtils.mod(123.5, 2)).toBe(1.5);
    expect(BpxUtils.mod(123.5, 1)).toBe(0.5);

    expect(BpxUtils.mod(-123.5, 1000)).toBe(876.5);
    expect(BpxUtils.mod(-1123.5, 1000)).toBe(876.5);
    expect(BpxUtils.mod(-123.5, 100)).toBe(76.5);
    expect(BpxUtils.mod(-123.5, 2)).toBe(0.5);
    expect(BpxUtils.mod(-123.5, 1)).toBe(0.5);
  });

  test(`#randomElementOf`, () => {
    expect(BpxUtils.randomElementOf([])).toBeUndefined();

    expect(BpxUtils.randomElementOf([123])).toEqual(123);

    const expectedSamplesPerElement = 100;
    const elements = [0, 1, 2];
    const results = elements.map(() => 0);
    BpxUtils.range(elements.length * expectedSamplesPerElement).forEach(() => {
      const pickedElement =
        BpxUtils.randomElementOf(elements) ??
        BpxUtils.throwError("element should be defined");
      results[pickedElement] += 1;
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

  test("#range", () => {
    expect(BpxUtils.range(0)).toEqual([]);
    expect(BpxUtils.range(1)).toEqual([0]);
    expect(BpxUtils.range(2)).toEqual([0, 1]);
    expect(BpxUtils.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("#trigAtan2", () => {
    expect(BpxUtils.trigAtan2(12.3, 0)).toEqual(0 / 8);
    expect(BpxUtils.trigAtan2(12.3, 12.3)).toEqual(1 / 8);
    expect(BpxUtils.trigAtan2(0, 12.3)).toEqual(2 / 8);
    expect(BpxUtils.trigAtan2(-12.3, 12.3)).toEqual(3 / 8);
    expect(BpxUtils.trigAtan2(-12.3, 0)).toEqual(4 / 8);
    expect(BpxUtils.trigAtan2(-12.3, -12.3)).toEqual(5 / 8);
    expect(BpxUtils.trigAtan2(0, -12.3)).toEqual(6 / 8);
    expect(BpxUtils.trigAtan2(12.3, -12.3)).toEqual(7 / 8);
  });

  test("#trigCos", () => {
    expect(BpxUtils.trigCos(0 / 8)).toBeCloseTo(1, 2);
    expect(BpxUtils.trigCos(1 / 8)).toBeCloseTo(0.71, 2);
    expect(BpxUtils.trigCos(2 / 8)).toBeCloseTo(0, 2);
    expect(BpxUtils.trigCos(3 / 8)).toBeCloseTo(-0.71, 2);
    expect(BpxUtils.trigCos(4 / 8)).toBeCloseTo(-1, 2);
    expect(BpxUtils.trigCos(5 / 8)).toBeCloseTo(-0.71, 2);
    expect(BpxUtils.trigCos(6 / 8)).toBeCloseTo(0, 2);
    expect(BpxUtils.trigCos(7 / 8)).toBeCloseTo(0.71, 2);
  });

  test("#trigSin", () => {
    expect(BpxUtils.trigSin(0 / 8)).toBeCloseTo(0, 2);
    expect(BpxUtils.trigSin(1 / 8)).toBeCloseTo(0.71, 2);
    expect(BpxUtils.trigSin(2 / 8)).toBeCloseTo(1, 2);
    expect(BpxUtils.trigSin(3 / 8)).toBeCloseTo(0.71, 2);
    expect(BpxUtils.trigSin(4 / 8)).toBeCloseTo(0, 2);
    expect(BpxUtils.trigSin(5 / 8)).toBeCloseTo(-0.71, 2);
    expect(BpxUtils.trigSin(6 / 8)).toBeCloseTo(-1, 2);
    expect(BpxUtils.trigSin(7 / 8)).toBeCloseTo(-0.71, 2);
  });
});
