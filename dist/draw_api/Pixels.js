import { BpxVector2d } from "../misc/Vector2d";
/**
 * A 1-bit image rectangular image defined in-code.
 *
 * @category Drawing
 */
export class BpxPixels {
    /**
     * @example
     * ```ts
     * BpxPixels.from(`
     *   #####
     *   #-#-#
     *   #-#-#
     *   #####
     * `);
     * ```
     *
     * @group Static factories
     */
    static from(ascii) {
        return new BpxPixels(ascii);
    }
    /**
     * The `#`/`-` representation of the image, split into rows.
     */
    asciiRows;
    /**
     * The size of the image.
     */
    size;
    constructor(ascii) {
        this.asciiRows = ascii
            .split("\n")
            .map(row => row.replace(/\s/g, ""))
            .filter(row => row.length > 0);
        let w = 0;
        for (const row of this.asciiRows) {
            const indexOfUnexpectedChar = row.search(/[^#-]/);
            if (indexOfUnexpectedChar >= 0) {
                throw Error(`DrawPixels.draw: Unexpected character found: "${row[indexOfUnexpectedChar]}"`);
            }
            w = Math.max(w, row.length);
        }
        this.size = BpxVector2d.of(w, this.asciiRows.length);
    }
}
