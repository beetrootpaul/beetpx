import { BpxVector2d, v_ } from "../misc/Vector2d";

export class BpxPixels {
  static from(ascii: string): BpxPixels {
    return new BpxPixels(ascii);
  }

  readonly asciiRows: string[];

  readonly wh: BpxVector2d;

  constructor(ascii: string) {
    this.asciiRows = ascii
      .split("\n")
      .map((row) => row.replace(/\s/g, ""))
      .filter((row) => row.length > 0);

    let w = 0;
    for (const row of this.asciiRows) {
      const indexOfUnexpectedChar = row.search(/[^#-]/);
      if (indexOfUnexpectedChar >= 0) {
        throw Error(
          `DrawPixels.draw: Unexpected character found: "${row[indexOfUnexpectedChar]}"`,
        );
      }
      w = Math.max(w, row.length);
    }
    this.wh = v_(w, this.asciiRows.length);
  }
}
