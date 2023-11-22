"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpxPixels = void 0;
const Vector2d_1 = require("../misc/Vector2d");
class BpxPixels {
    static from(ascii) {
        return new BpxPixels(ascii);
    }
    constructor(ascii) {
        this.asciiRows = ascii
            .split("\n")
            .map((row) => row.replace(/\s/g, ""))
            .filter((row) => row.length > 0);
        let w = 0;
        for (const row of this.asciiRows) {
            const indexOfUnexpectedChar = row.search(/[^#-]/);
            if (indexOfUnexpectedChar >= 0) {
                throw Error(`DrawPixels.draw: Unexpected character found: "${row[indexOfUnexpectedChar]}"`);
            }
            w = Math.max(w, row.length);
        }
        this.wh = new Vector2d_1.BpxVector2d(w, this.asciiRows.length);
    }
}
exports.BpxPixels = BpxPixels;
