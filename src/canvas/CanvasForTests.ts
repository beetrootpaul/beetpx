import { expect } from "@jest/globals";
import { u_ } from "../Utils";
import { BpxRgbColor, BpxRgbCssHex } from "../color/RgbColor";
import { BpxVector2d, v_ } from "../misc/Vector2d";
import { Canvas } from "./Canvas";
import { CanvasSnapshot } from "./CanvasSnapshot";
import { CanvasSnapshotForTests } from "./CanvasSnapshotForTests";

export class CanvasForTests extends Canvas {
  readonly #length: number;
  readonly #rgbValues: number[];

  #minX: number;
  #minY: number;
  #maxX: number;
  #maxY: number;

  constructor(width: number, height: number, initialColor: BpxRgbColor) {
    super(v_(width, height));

    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = width - 1;
    this.#maxY = height - 1;

    this.#length = width * height;
    this.#rgbValues = u_
      .range(this.#length)
      .map(
        () => (initialColor.r << 16) + (initialColor.g << 8) + initialColor.b,
      );
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );
    this.#minX = xyMinInclusive.x;
    this.#minY = xyMinInclusive.y;
    this.#maxX = xyMaxExclusive.x - 1;
    this.#maxY = xyMaxExclusive.y - 1;
  }

  removeClippingRegion(): void {
    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = this.canvasSize.x - 1;
    this.#maxY = this.canvasSize.y - 1;
  }

  canSetAny(xMin: number, yMin: number, xMax: number, yMax: number): boolean {
    return (
      xMax >= this.#minX &&
      yMax >= this.#minY &&
      xMin <= this.#maxX &&
      yMin <= this.#maxY
    );
  }

  canSetAt(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.canvasSize.x && y < this.canvasSize.y;
  }

  set(color: BpxRgbColor, x: number, y: number): void {
    if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
      throw Error(
        `(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${
          this.canvasSize.x - 1
        },${this.canvasSize.y - 1})`,
      );
    }

    const index = y * this.canvasSize.x + x;

    if (index >= this.#length) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#length - 1
        }`,
      );
    }

    this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
  }

  newSnapshot(): CanvasSnapshot {
    return new CanvasSnapshotForTests(this.#rgbValues.slice());
  }

  doRender(): void {}

  expectToEqual(params: {
    withMapping: Record<string, BpxRgbColor>;
    expectedImageAsAscii: string;
  }) {
    const { withMapping: asciiToColor, expectedImageAsAscii } = params;

    const colorToAscii: Map<BpxRgbCssHex, string> = new Map(
      Object.entries(asciiToColor).map(([ascii, color]) => [
        color.cssHex,
        ascii,
      ]),
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

  #asAscii(colorToAscii: Map<BpxRgbCssHex, string>): string {
    let asciiImage = "";

    const snapshot = new CanvasSnapshotForTests(this.#rgbValues.slice());
    for (let y = 0; y < this.canvasSize.y; y += 1) {
      for (let x = 0; x < this.canvasSize.x; x += 1) {
        const index = y * this.canvasSize.x + x;
        const color = snapshot.getColorAtIndex(index);
        asciiImage += colorToAscii.get(color.cssHex) ?? "?";
      }
      asciiImage += "\n";
    }

    return asciiImage
      .split("\n")
      .map((line) => line.split("").join(" "))
      .join("\n");
  }
}
