import { expect } from "@jest/globals";
import { BpxColorId, BpxSolidColor } from "../Color";
import { v_ } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { CanvasPixels2d } from "./canvas_pixels/CanvasPixels2d";

export class TestCanvas {
  readonly pixels: CanvasPixels;

  constructor(width: number, height: number, color: BpxSolidColor) {
    this.pixels = new CanvasPixels2d(
      v_(width, height),
      new Uint8ClampedArray(0),
    );
    for (let i = 0; i < width * height; i += 1) {
      this.pixels.set(i, color);
    }
  }

  expectToEqual(params: {
    withMapping: Record<string, BpxSolidColor>;
    expectedImageAsAscii: string;
  }) {
    const { withMapping: asciiToColor, expectedImageAsAscii } = params;

    const colorToAscii: Map<BpxColorId, string> = new Map(
      Object.entries(asciiToColor).map(([ascii, color]) => [color.id, ascii]),
    );

    const actualAscii = this.#asAscii(colorToAscii);

    const expectedAscii =
      expectedImageAsAscii
        .trim()
        .split("\n")
        .map((line) =>
          line
            .trim()
            .split("")
            .filter((char) => char !== " ")
            .join(" "),
        )
        .filter((line) => line.length > 0)
        .join("\n") + "\n";

    expect(actualAscii).toEqual(expectedAscii);
  }

  #asAscii(colorToAscii: Map<BpxColorId, string>): string {
    let asciiImage = "";

    for (let y = 0; y < this.pixels.canvasSize.y; y += 1) {
      for (let x = 0; x < this.pixels.canvasSize.x; x += 1) {
        const index = y * this.pixels.canvasSize.x + x;
        const color = this.pixels.get(index);
        asciiImage += colorToAscii.get(color.id) ?? "?";
      }
      asciiImage += "\n";
    }

    return asciiImage
      .split("\n")
      .map((line) => line.split("").join(" "))
      .join("\n");
  }
}
