"use strict";
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
var _FillPattern_bits;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillPattern = void 0;
class FillPattern {
    // TODO: create a helper to generate FillPattern from ASCII
    static of(bits) {
        return new FillPattern(bits);
    }
    // TODO: tests that bits do not have for example an accidental extra digit in its binary representation. It happened to me in tests and debugging was a hell
    constructor(bits) {
        _FillPattern_bits.set(this, void 0);
        __classPrivateFieldSet(this, _FillPattern_bits, bits, "f");
    }
    hasPrimaryColorAt(xy) {
        const patternXy = xy.mod(4);
        const bitPosition = 4 * 4 - (patternXy.y * 4 + patternXy.x) - 1;
        const isSecondary = Boolean(__classPrivateFieldGet(this, _FillPattern_bits, "f") & (1 << bitPosition));
        return !isSecondary;
    }
}
exports.FillPattern = FillPattern;
_FillPattern_bits = new WeakMap();
// noinspection JSUnusedGlobalSymbols
FillPattern.primaryOnly = new FillPattern(0);
// noinspection JSUnusedGlobalSymbols
FillPattern.secondaryOnly = new FillPattern(65535);
