import { expect } from "@jest/globals";
import { ColorId, SolidColor } from "../Color";
import { Vector2d, v_ } from "../Vector2d";

export class TestCanvas {
  readonly size: Vector2d;
  readonly bytes: Uint8ClampedArray;

  constructor(width: number, height: number, color: SolidColor) {
    this.size = v_(width, height);
    this.bytes = new Uint8ClampedArray(4 * width * height);
    for (let i = 0; i < width * height; i += 1) {
      this.bytes[4 * i] = color.r;
      this.bytes[4 * i + 1] = color.g;
      this.bytes[4 * i + 2] = color.b;
      this.bytes[4 * i + 3] = 0xff;
    }
  }

  expectToEqual(params: {
    withMapping: Record<string, SolidColor>;
    expectedImageAsAscii: string;
  }) {
    // first, let's check if bytes didn't increase in their length

    expect(this.bytes.length).toEqual(this.size.x * this.size.y * 4);

    // then, let's proceed to the actual image check

    const { withMapping: asciiToColor, expectedImageAsAscii } = params;

    const colorToAscii: Map<ColorId, string> = new Map(
      Object.entries(asciiToColor).map(([ascii, color]) => [color.id, ascii]),
    );

    const actualAscii = this.#asAscii(colorToAscii);

    const expectedAscii =
      params.expectedImageAsAscii
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

  #asAscii(colorToAscii: Map<ColorId, string>): string {
    let asciiImage = "";

    for (let y = 0; y < this.size.y; y += 1) {
      for (let x = 0; x < this.size.x; x += 1) {
        const i = 4 * (y * this.size.x + x);
        const colorBytes = this.bytes.slice(i, i + 4);
        if (colorBytes[3] !== 0xff) {
          asciiImage += "!";
        } else {
          const color = new SolidColor(
            colorBytes[0]!,
            colorBytes[1]!,
            colorBytes[2]!,
          );
          asciiImage += colorToAscii.get(color.id) ?? "?";
        }
      }
      asciiImage += "\n";
    }

    return asciiImage
      .split("\n")
      .map((line) => line.split("").join(" "))
      .join("\n");
  }
}
