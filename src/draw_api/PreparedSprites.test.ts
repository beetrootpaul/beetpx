import { PngDataArray } from "fast-png";
import { describe, expect, test } from "vitest";
import { $spr } from "../shorthands";
import { range } from "../utils/range";
import { PreparedSprites } from "./PreparedSprites";

const imgW1: number = 100;
const imgH1: number = 150;
const imgW2: number = 200;
const imgH2: number = 250;
const imgChannels1: 3 | 4 = 3;
const imgChannels2: 3 | 4 = 4;
const pngData1: PngDataArray = new Uint8ClampedArray(
  range(imgW1 * imgH1 * imgChannels1).map((_, index) => 123 + (index % 0x100)),
);
const pngData2: PngDataArray = new Uint8ClampedArray(
  range(imgW2 * imgH2 * imgChannels2).map((_, index) => 234 + (index % 0x100)),
);

describe("PreparedSprites", () => {
  test("cache", () => {
    const preparedSprites = new PreparedSprites();

    // first time using a sprite
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(false);

    // the same sprite again
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(true);

    // another sprites of the same image
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 1, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(false);
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 2),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(false);
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(21, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(false);
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 31, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(false);

    // the previous sprite again
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(true);

    // a sprite of same xy and wh, but from another image
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image2")(20, 30, 0, 1),
        [true, false],
        pngData2,
        imgW2,
        imgChannels2,
      ).cacheHit,
    ).toBe(false);
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image2")(20, 30, 0, 1),
        [true, false],
        pngData2,
        imgW2,
        imgChannels2,
      ).cacheHit,
    ).toBe(true);

    // and the first sprite once again
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(true);

    // a sprite of same xy and wh, but another flip
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [false, true],
        pngData2,
        imgW2,
        imgChannels2,
      ).cacheHit,
    ).toBe(false);
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [false, true],
        pngData2,
        imgW2,
        imgChannels2,
      ).cacheHit,
    ).toBe(true);

    // and the first sprite once again
    expect(
      preparedSprites.prepareOrGetFromCache(
        $spr("image1")(20, 30, 0, 1),
        [true, false],
        pngData1,
        imgW1,
        imgChannels1,
      ).cacheHit,
    ).toBe(true);
  });
});
