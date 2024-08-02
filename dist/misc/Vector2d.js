import { clamp } from "../utils/clamp";
import { lerp } from "../utils/lerp";
import { mod } from "../utils/mod";
import { trigAtan2 } from "../utils/trigAtan2";
import { trigCos } from "../utils/trigCos";
import { trigSin } from "../utils/trigSin";
/**
 * A core building block for many pieces of the BeetPx API – a vector, which is 2D point representation of (X,Y).
 *
 * @category Core
 */
export class BpxVector2d {
    x;
    y;
    /**
     * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     *
     * @returns A vector of a length 1, angled according to a given `turnAngle`. E.g. `(0, -1)` for an angle of `-0.25`.
     *
     * @group Static factories
     */
    static unitFromAngle(turnAngle) {
        return new BpxVector2d(trigCos(turnAngle), trigSin(turnAngle));
    }
    static of(valueOrX, maybeY) {
        return new BpxVector2d(valueOrX, maybeY ?? valueOrX);
    }
    constructor(
    /**
     * The X component of the vector.
     */
    x, 
    /**
     * The X component of the vector.
     */
    y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Creates a vector which has the lowest X and Y from two other given vectors.
     *
     * @group Static factories
     */
    static min(xy1, xy2) {
        return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    }
    /**
     * Creates a vector which has the highest X and Y from two other given vectors.
     *
     * @group Static factories
     */
    static max(xy1, xy2) {
        return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    }
    /**
     * An equivalent of `[BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)]`.
     *
     * @example
     * ```ts
     * const [minV, maxV] = BpxVector2d.minMax(v1, v2);
     * ```
     *
     * @group Static factories
     */
    static minMax(xy1, xy2) {
        return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
    }
    /**
     * Creates a vector with X and Y passed through the {@link BeetPxUtils.lerp} individually.
     *
     * @group Static factories
     */
    static lerp(xy1, xy2, t, opts) {
        return new BpxVector2d(lerp(xy1.x, xy2.x, t, opts), lerp(xy1.y, xy2.y, t, opts));
    }
    
    /**
     * @returns An array of `[x, y]`.
     */
    asArray() {
        return [this.x, this.y];
    }
    /**
     * @returns A magnitude of the vector, which is `sqrt(x^2 + y^2)`.
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * @returns A vector of same angle, but of length 1.
     */
    normalize() {
        const m = this.magnitude();
        return new BpxVector2d(this.x / m, this.y / m);
    }
    /**
     * @returns A vector in which each component is either `-1`, `0`, or `1` to indicate the sign of the original value.
     */
    sign() {
        return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
    }
    /**
     * @returns A vector in which each component is an absolute value of the original value.
     */
    abs() {
        return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
    }
    /**
     * @returns A vector in which each component is a floor rounding of the original value.
     */
    floor() {
        return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * @returns A vector in which each component is a ceil rounding of the original value.
     */
    ceil() {
        return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
    }
    /**
     * @returns A vector in which each component is a rounding of the original value.
     */
    round() {
        return new BpxVector2d(Math.round(this.x), Math.round(this.y));
    }
    /**
     * @returns The "turn" of the vector. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle() {
        return trigAtan2(this.x, this.y);
    }
    eq(otherOrValue) {
        return typeof otherOrValue !== "number" ?
            this.x === otherOrValue.x && this.y === otherOrValue.y
            : this.x === otherOrValue && this.y === otherOrValue;
    }
    gt(otherOrValue) {
        return typeof otherOrValue !== "number" ?
            this.x > otherOrValue.x && this.y > otherOrValue.y
            : this.x > otherOrValue && this.y > otherOrValue;
    }
    gte(otherOrValue) {
        return typeof otherOrValue !== "number" ?
            this.x >= otherOrValue.x && this.y >= otherOrValue.y
            : this.x >= otherOrValue && this.y >= otherOrValue;
    }
    lt(otherOrValue) {
        return typeof otherOrValue !== "number" ?
            this.x < otherOrValue.x && this.y < otherOrValue.y
            : this.x < otherOrValue && this.y < otherOrValue;
    }
    lte(otherOrValue) {
        return typeof otherOrValue !== "number" ?
            this.x <= otherOrValue.x && this.y <= otherOrValue.y
            : this.x <= otherOrValue && this.y <= otherOrValue;
    }
    /**
     * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.clamp} individually.
     */
    clamp(xy1, xy2) {
        return new BpxVector2d(clamp(xy1.x, this.x, xy2.x), clamp(xy1.y, this.y, xy2.y));
    }
    mod(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number" ?
            new BpxVector2d(mod(this.x, otherOrValueOrX.x), mod(this.y, otherOrValueOrX.y))
            : new BpxVector2d(mod(this.x, otherOrValueOrX), mod(this.y, maybeY ?? otherOrValueOrX));
    }
    add(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number" ?
            new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
            : new BpxVector2d(this.x + otherOrValueOrX, this.y + (maybeY ?? otherOrValueOrX));
    }
    sub(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number" ?
            new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
            : new BpxVector2d(this.x - otherOrValueOrX, this.y - (maybeY ?? otherOrValueOrX));
    }
    mul(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number" ?
            new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
            : new BpxVector2d(this.x * otherOrValueOrX, this.y * (maybeY ?? otherOrValueOrX));
    }
    div(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number" ?
            new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
            : new BpxVector2d(this.x / otherOrValueOrX, this.y / (maybeY ?? otherOrValueOrX));
    }
    
    /**
     * This definition allows to "spread" the vector, e.g.: `[...myVector]`.
     *
     * @see https:
     */
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    /**
     * This definition serializes the vector to a string `(x,y)` when coercion happens, e.g.: `+myVector`.
     *
     * @see https:
     */
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case "default":
            case "string":
                return `(${this.x},${this.y})`;
            case "number":
                return NaN;
        }
    }
    /**
     * This definition makes the vector represented with its class names in those scenario where normally
     * you would see `[object Object]` in logs.
     *
     * @see https:
     */
    get [Symbol.toStringTag]() {
        return "BpxVector2d";
    }
    /**
     * A convenience method used by the internal logger to print vectors no as JS object,
     * but as `(x, y)` strings.
     *
     * Usually you wouldn't have to call this method directly in your game code.
     *
     * @see {@link BpxPrintDebug}
     * @see {@link BeetPx.logDebug}
     * @see {@link BeetPx.logInfo}
     * @see {@link BeetPx.logWarn}
     * @see {@link BeetPx.logError}
     */
    __printDebug() {
        return `(${this.x},${this.y})`;
    }
}
