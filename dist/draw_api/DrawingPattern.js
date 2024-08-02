/**
 * A 4x4 drawing pattern definition of which pixels should be drawn with the `primary`
 * and which with the `secondary` of {@link BpxPatternColors}.
 *
 * @example
 * ```ts
 * const prevPattern = $d.setDrawingPattern(BpxDrawingPattern.from(`
 *   ##--
 *   ##--
 *   --##
 *   --##
 * `));
 * $d.rectFilled($v(10), $v(20), BpxPatternColors.of($rgb_red, $rgb_blue));
 * $d.setDrawingPattern(prevPattern);
 * ```
 *
 * @category Drawing
 */
export class BpxDrawingPattern {
    /**
     * Creates a BpxDrawingPattern from a visual representation of 4 columns and 4 rows
     *   (designated by new lines) where `#` and `-` stand for a primary and
     *   a secondary color. Whitespaces are ignored.
     *
     * @category Static factories
     */
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
    /**
     * Creates a BpxDrawingPattern from a numeric representation of 4 columns and 4 rows.
     * Recommended way is to defined the pattern as a binary number, with group separator
     * put between each 4 digits, e.g. `0b0101_1010_0101_1010`. The `1` stands for the primary
     * color and the `0` – for the secondary one.
     *
     * @category Static factories
     */
    static of(bits) {
        return new BpxDrawingPattern(bits);
    }
    /**
     * The pattern used by default, which uses the primary color only.
     * An equivalent of `BpxDrawingPattern.of(0b1111_1111_1111_1111)`.
     *
     * @category Static values
     */
    static primaryOnly = BpxDrawingPattern.of(0b1111_1111_1111_1111);
    /**
     * The pattern which uses the secondary color only.
     * An equivalent of `BpxDrawingPattern.of(0b0000_0000_0000_0000)`.
     *
     * @category Static values
     */
    static secondaryOnly = BpxDrawingPattern.of(0b0000_0000_0000_0000);
    #bits;
    constructor(bits) {
        if (bits < 0b0000_0000_0000_0000 || bits > 0b1111_1111_1111_1111) {
            throw Error(`BpxPatter: bits representation of the pattern is out of range of valid values. The value should be in range of 0b0000_0000_0000_0000 to 0b1111_1111_1111_1111.`);
        }
        this.#bits = bits;
    }
    /**
     * The method to check whether a primary or a secondary color should be put at a given (X,Y)
     * when this pattern is applied.
     *
     * Usually, you wouldn't have to use this method, since it's already used by internals of
     * BeetPx drawing API.
     */
    hasPrimaryColorAt(x, y) {
        const patternX = x % 4;
        const patternY = y % 4;
        const bitPosition = 4 * 4 - (patternY * 4 + patternX) - 1;
        return Boolean(this.#bits & (1 << bitPosition));
    }
}
