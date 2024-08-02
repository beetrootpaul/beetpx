import { BpxVector2d } from "../misc/Vector2d";

/**
 * TODO: docs
 */
export class BpxPixels {
  /**
   * TODO: docs
   */
  static from(ascii: string): BpxPixels {
    return new BpxPixels(ascii);
  }

  /**
   * TODO: docs
   */
  readonly asciiRows: string[];

  /**
   * TODO: docs
   */
  readonly size: BpxVector2d;

  private constructor(ascii: string) {
    this.asciiRows = ascii
      .split("\n")
      .map(row => row.replace(/\s/g, ""))
      .filter(row => row.length > 0);

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
    this.size = BpxVector2d.of(w, this.asciiRows.length);
  }
}
