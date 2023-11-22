var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxPattern_bits;
export class BpxPattern {
    /**
     * Creates a BpxPattern from a visual representation of 4 columns and 4 rows
     *   (designated by new lines) where `#` and `-` stand for a primary and
     *   a secondary color. Whitespaces are ignored.
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
        return new BpxPattern(bits);
    }
    static of(bits) {
        return new BpxPattern(bits);
    }
    constructor(bits) {
        _BpxPattern_bits.set(this, void 0);
        if (bits < 0 || bits > 65535) {
            throw Error(`BpxPatter: bits representation of the pattern is out of range of valid values. The value should be in range of 0b0000_0000_0000_0000 to 0b1111_1111_1111_1111.`);
        }
        __classPrivateFieldSet(this, _BpxPattern_bits, bits, "f");
    }
    hasPrimaryColorAt(x, y) {
        const patternX = x % 4;
        const patternY = y % 4;
        const bitPosition = 4 * 4 - (patternY * 4 + patternX) - 1;
        return Boolean(__classPrivateFieldGet(this, _BpxPattern_bits, "f") & (1 << bitPosition));
    }
}
_BpxPattern_bits = new WeakMap();
BpxPattern.primaryOnly = BpxPattern.of(65535);
BpxPattern.secondaryOnly = BpxPattern.of(0);
