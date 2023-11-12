import { expect } from "@jest/globals";
import { Canvas } from "../canvas_pixels/Canvas";
import { CanvasForTests } from "../canvas_pixels/CanvasForTests";
import { BpxColorId, BpxSolidColor } from "../misc/Color";
import { v_ } from "../misc/Vector2d";

export class TestCanvas {
  readonly canvas: Canvas;

  constructor(width: number, height: number, color: BpxSolidColor) {
    this.canvas = new CanvasForTests(v_(width, height));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.canvas.set(color, x, y);
      }
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

    const snapshotId = this.canvas.takeSnapshot();
    const snapshot = this.canvas.getSnapshot(snapshotId)!;
    for (let y = 0; y < this.canvas.canvasSize.y; y += 1) {
      for (let x = 0; x < this.canvas.canvasSize.x; x += 1) {
        const index = y * this.canvas.canvasSize.x + x;
        const color = snapshot.get(index);
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
