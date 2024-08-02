export class BpxDrawingPattern {
    static from(ascii) {
        ascii = ascii.replace(/\s/g, "");
        const indexOfUnexpectedChar = ascii.search(/[^#-]/);
        if (indexOfUnexpectedChar >= 0) {
            throw Error(`BpxPattern.from: Unexpected character found: "${ascii[indexOfUnexpectedChar]}"`);
        }
        if (ascii.length !== 16) {
            throw Error(`BpxPattern.from: Unexpected amount of # and - symbols. There should be 16 of them (4 rows x 4 columns), but instead there is: ${ascii.length}`);
        }
        let bits = 0;
        for (let index = 0; index < 16; ++index) {
            if (ascii[index] === "#") {
                bits |= 1 << (15 - index);
            }
        }
        return new BpxDrawingPattern(bits);
    }
    static of(bits) {
        return new BpxDrawingPattern(bits);
    }
    static primaryOnly = BpxDrawingPattern.of(0b1111_1111_1111_1111);
    static secondaryOnly = BpxDrawingPattern.of(0b0000_0000_0000_0000);
    #bits;
    constructor(bits) {
        if (bits < 0b0000_0000_0000_0000 || bits > 0b1111_1111_1111_1111) {
            throw Error(`BpxPatter: bits representation of the pattern is out of range of valid values. The value should be in range of 0b0000_0000_0000_0000 to 0b1111_1111_1111_1111.`);
        }
        this.#bits = bits;
    }
    hasPrimaryColorAt(x, y) {
        const patternX = x % 4;
        const patternY = y % 4;
        const bitPosition = 4 * 4 - (patternY * 4 + patternX) - 1;
        return Boolean(this.#bits & (1 << bitPosition));
    }
}
//# sourceMappingURL=DrawingPattern.js.map