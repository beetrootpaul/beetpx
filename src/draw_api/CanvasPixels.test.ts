import { describe, expect, test } from "@jest/globals";
import { BpxSolidColor } from "../Color";
import { v_ } from "../Vector2d";
import { CanvasPixels } from "./CanvasPixels";

describe("CanvasPixels", () => {
  test("#set/#get", () => {
    const canvasPixels = new CanvasPixels(v_(2, 3));

    canvasPixels.set(0, BpxSolidColor.fromRgbCssHex("#102030"));
    canvasPixels.set(1, BpxSolidColor.fromRgbCssHex("#112131"));
    canvasPixels.set(2, BpxSolidColor.fromRgbCssHex("#122232"));
    canvasPixels.set(3, BpxSolidColor.fromRgbCssHex("#132333"));
    canvasPixels.set(4, BpxSolidColor.fromRgbCssHex("#142434"));
    canvasPixels.set(5, BpxSolidColor.fromRgbCssHex("#152535"));

    expect(canvasPixels.get(0).asRgbCssHex()).toEqual("#102030");
    expect(canvasPixels.get(1).asRgbCssHex()).toEqual("#112131");
    expect(canvasPixels.get(2).asRgbCssHex()).toEqual("#122232");
    expect(canvasPixels.get(3).asRgbCssHex()).toEqual("#132333");
    expect(canvasPixels.get(4).asRgbCssHex()).toEqual("#142434");
    expect(canvasPixels.get(5).asRgbCssHex()).toEqual("#152535");

    canvasPixels.set(0, BpxSolidColor.fromRgbCssHex("#000000"));

    expect(canvasPixels.get(0).asRgbCssHex()).toEqual("#000000");

    canvasPixels.set(0, BpxSolidColor.fromRgbCssHex("#ffffff"));

    expect(canvasPixels.get(0).asRgbCssHex()).toEqual("#ffffff");
  });
});
