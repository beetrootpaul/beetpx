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
    
    static of(bits) {
        return new BpxPattern(bits);
    }
    
    constructor(bits) {
        _BpxPattern_bits.set(this, void 0);
        __classPrivateFieldSet(this, _BpxPattern_bits, bits, "f");
    }
    hasPrimaryColorAt(x, y) {
        const patternX = x % 4;
        const patternY = y % 4;
        const bitPosition = 4 * 4 - (patternY * 4 + patternX) - 1;
        const isSecondary = Boolean(__classPrivateFieldGet(this, _BpxPattern_bits, "f") & (1 << bitPosition));
        return !isSecondary;
    }
}
_BpxPattern_bits = new WeakMap();
BpxPattern.primaryOnly = new BpxPattern(0);
BpxPattern.secondaryOnly = new BpxPattern(65535);
