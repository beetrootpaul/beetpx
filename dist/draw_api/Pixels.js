import { BpxVector2d } from "../misc/Vector2d";
export class BpxPixels {
    static from(ascii) {
        return new BpxPixels(ascii);
    }
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
