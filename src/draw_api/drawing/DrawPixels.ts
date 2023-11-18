import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";

export class DrawPixels {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(
    xy: BpxVector2d,
    ascii: string,
    color: BpxRgbColor,
    pattern: BpxPattern,
  ): void {
    xy = xy.round();
    const asciiRows = ascii
      .split("\n")
      .map((row) => row.replace(/\s/g, ""))
      .filter((row) => row.length > 0);

    for (const row of asciiRows) {
      const indexOfUnexpectedChar = row.search(/[^#-]/);
      if (indexOfUnexpectedChar >= 0) {
        throw Error(
          `DrawPixels.draw: Unexpected character found: "${row[indexOfUnexpectedChar]}"`,
        );
      }
    }

    for (let bitsY = 0; bitsY < asciiRows.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < asciiRows[bitsY]!.length; bitsX += 1) {
        if (asciiRows[bitsY]![bitsX] !== "#") {
          continue;
        }

        const x = xy.x + bitsX;
        const y = xy.y + bitsY;
        if (pattern.hasPrimaryColorAt(x, y)) {
          if (this.#canvas.canSetAt(x, y)) {
            this.#canvas.set(color, x, y);
          }
        }
      }
    }
  }
}
