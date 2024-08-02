import { BpxPrintDebug } from "../debug/PrintDebug";
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
export class BpxVector2d implements BpxPrintDebug {
  /**
   * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   *
   * @returns A vector of a length 1, angled according to a given `turnAngle`. E.g. `(0, -1)` for an angle of `-0.25`.
   *
   * @group Static factories
   */
  static unitFromAngle(turnAngle: number): BpxVector2d {
    return new BpxVector2d(trigCos(turnAngle), trigSin(turnAngle));
  }

  /**
   * An equivalent of `BpxVector2d.of(value, value)`.
   *
   * @group Static factories
   */
  static of(value: number): BpxVector2d;
  /**
   * @group Static factories
   */
  static of(x: number, y: number): BpxVector2d;
  static of(valueOrX: number, maybeY?: number): BpxVector2d {
    return new BpxVector2d(valueOrX, maybeY ?? valueOrX);
  }

  private constructor(
    /**
     * The X component of the vector.
     */
    readonly x: number,
    /**
     * The X component of the vector.
     */
    readonly y: number,
  ) {}

  /////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a vector which has the lowest X and Y from two other given vectors.
   *
   * @group Static factories
   */
  static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
  }

  /**
   * Creates a vector which has the highest X and Y from two other given vectors.
   *
   * @group Static factories
   */
  static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
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
  static minMax(
    xy1: BpxVector2d,
    xy2: BpxVector2d,
  ): [BpxVector2d, BpxVector2d] {
    return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
  }

  /**
   * Creates a vector with X and Y passed through the {@link BeetPxUtils.lerp} individually.
   *
   * @group Static factories
   */
  static lerp(
    xy1: BpxVector2d,
    xy2: BpxVector2d,
    t: number,
    opts?: { clamp?: boolean },
  ): BpxVector2d {
    return new BpxVector2d(
      lerp(xy1.x, xy2.x, t, opts),
      lerp(xy1.y, xy2.y, t, opts),
    );
  }

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @returns An array of `[x, y]`.
   */
  asArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * @returns A magnitude of the vector, which is `sqrt(x^2 + y^2)`.
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * @returns A vector of same angle, but of length 1.
   */
  normalize(): BpxVector2d {
    const m = this.magnitude();
    return new BpxVector2d(this.x / m, this.y / m);
  }

  /**
   * @returns A vector in which each component is either `-1`, `0`, or `1` to indicate the sign of the original value.
   */
  sign(): BpxVector2d {
    return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
  }

  /**
   * @returns A vector in which each component is an absolute value of the original value.
   */
  abs(): BpxVector2d {
    return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
  }

  /**
   * @returns A vector in which each component is a floor rounding of the original value.
   */
  floor(): BpxVector2d {
    return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
  }

  /**
   * @returns A vector in which each component is a ceil rounding of the original value.
   */
  ceil(): BpxVector2d {
    return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
  }

  /**
   * @returns A vector in which each component is a rounding of the original value.
   */
  round(): BpxVector2d {
    return new BpxVector2d(Math.round(this.x), Math.round(this.y));
  }

  /**
   * @returns The "turn" of the vector. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  toAngle(): number {
    return trigAtan2(this.x, this.y);
  }

  /**
   * @returns If the vector has both of its components equal to the same components of a given vector.
   */
  eq(other: BpxVector2d): boolean;
  /**
   * @returns If the vector has both of its components equal to a given value.
   */
  eq(value: number): boolean;
  eq(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number" ?
        this.x === otherOrValue.x && this.y === otherOrValue.y
      : this.x === otherOrValue && this.y === otherOrValue;
  }

  /**
   * @returns If the vector has both of its components greater than the same components of a given vector.
   */
  gt(other: BpxVector2d): boolean;
  /**
   * @returns If the vector has both of its components greater than a given value.
   */
  gt(value: number): boolean;
  gt(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number" ?
        this.x > otherOrValue.x && this.y > otherOrValue.y
      : this.x > otherOrValue && this.y > otherOrValue;
  }

  /**
   * @returns If the vector has both of its components greater or equal to the same components of a given vector.
   */
  gte(other: BpxVector2d): boolean;
  /**
   * @returns If the vector has both of its components greater or equal to a given value.
   */
  gte(value: number): boolean;
  gte(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number" ?
        this.x >= otherOrValue.x && this.y >= otherOrValue.y
      : this.x >= otherOrValue && this.y >= otherOrValue;
  }

  /**
   * @returns If the vector has both of its components lower than the same components of a given vector.
   */
  lt(other: BpxVector2d): boolean;
  /**
   * @returns If the vector has both of its components lower than a given value.
   */
  lt(value: number): boolean;
  lt(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number" ?
        this.x < otherOrValue.x && this.y < otherOrValue.y
      : this.x < otherOrValue && this.y < otherOrValue;
  }

  /**
   * @returns If the vector has both of its components lower or equal to the same components of a given vector.
   */
  lte(other: BpxVector2d): boolean;
  /**
   * @returns If the vector has both of its components lower or equal to a given value.
   */
  lte(value: number): boolean;
  lte(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number" ?
        this.x <= otherOrValue.x && this.y <= otherOrValue.y
      : this.x <= otherOrValue && this.y <= otherOrValue;
  }

  /**
   * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.clamp} individually.
   */
  clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return new BpxVector2d(
      clamp(xy1.x, this.x, xy2.x),
      clamp(xy1.y, this.y, xy2.y),
    );
  }

  /**
   * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
   *          This variant of the method uses X and Y of another vector to run `mod` on both X and Y
   *          respectively.
   */
  mod(other: BpxVector2d): BpxVector2d;
  /**
   * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
   *          This variant of the method uses a single value to run `mod` on both X and Y
   *          with it.
   */
  mod(value: number): BpxVector2d;
  /**
   * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
   *          This variant of the method uses X and Y to run `mod` on both X and Y
   *          respectively.
   */
  mod(x: number, y: number): BpxVector2d;
  mod(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number" ?
        new BpxVector2d(
          mod(this.x, otherOrValueOrX.x),
          mod(this.y, otherOrValueOrX.y),
        )
      : new BpxVector2d(
          mod(this.x, otherOrValueOrX),
          mod(this.y, maybeY ?? otherOrValueOrX),
        );
  }

  /**
   * Addition.
   */
  add(other: BpxVector2d): BpxVector2d;
  /**
   * Addition.
   */
  add(value: number): BpxVector2d;
  /**
   * Addition.
   */
  add(x: number, y: number): BpxVector2d;
  add(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number" ?
        new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
      : new BpxVector2d(
          this.x + otherOrValueOrX,
          this.y + (maybeY ?? otherOrValueOrX),
        );
  }

  /**
   * Subtraction.
   */
  sub(other: BpxVector2d): BpxVector2d;
  /**
   * Subtraction.
   */
  sub(value: number): BpxVector2d;
  /**
   * Subtraction.
   */
  sub(x: number, y: number): BpxVector2d;
  sub(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number" ?
        new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
      : new BpxVector2d(
          this.x - otherOrValueOrX,
          this.y - (maybeY ?? otherOrValueOrX),
        );
  }

  /**
   * Multiplication.
   */
  mul(other: BpxVector2d): BpxVector2d;
  /**
   * Multiplication.
   */
  mul(value: number): BpxVector2d;
  /**
   * Multiplication.
   */
  mul(x: number, y: number): BpxVector2d;
  mul(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number" ?
        new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
      : new BpxVector2d(
          this.x * otherOrValueOrX,
          this.y * (maybeY ?? otherOrValueOrX),
        );
  }

  /**
   * Division.
   */
  div(other: BpxVector2d): BpxVector2d;
  /**
   * Division.
   */
  div(value: number): BpxVector2d;
  /**
   * Division.
   */
  div(x: number, y: number): BpxVector2d;
  div(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number" ?
        new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
      : new BpxVector2d(
          this.x / otherOrValueOrX,
          this.y / (maybeY ?? otherOrValueOrX),
        );
  }

  /////////////////////////////////////////////////////////////////////////////

  /**
   * This definition allows to "spread" the vector, e.g.: `[...myVector]`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
   */
  *[Symbol.iterator](): Generator<number> {
    yield this.x;
    yield this.y;
  }

  /**
   * This definition serializes the vector to a string `(x,y)` when coercion happens, e.g.: `+myVector`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
   */
  [Symbol.toPrimitive](hint: "default" | "string" | "number"): string | number {
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
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
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
  __printDebug(): string {
    return `(${this.x},${this.y})`;
  }
}
