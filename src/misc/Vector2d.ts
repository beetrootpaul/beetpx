import { PrintDebug } from "../debug/PrintDebug";
import { clamp } from "../utils/clamp";
import { lerp } from "../utils/lerp";
import { mod } from "../utils/mod";
import { trigAtan2 } from "../utils/trigAtan2";
import { trigCos } from "../utils/trigCos";
import { trigSin } from "../utils/trigSin";

export class BpxVector2d implements PrintDebug {
  /**
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static unitFromAngle(turnAngle: number): BpxVector2d {
    return new BpxVector2d(trigCos(turnAngle), trigSin(turnAngle));
  }

  static of(value: number): BpxVector2d;
  static of(x: number, y: number): BpxVector2d;
  static of(valueOrX: number, maybeY?: number): BpxVector2d {
    return new BpxVector2d(valueOrX, maybeY ?? valueOrX);
  }

  private constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  /////////////////////////////////////////////////////////////////////////////

  static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
  }

  static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
  }

  static minMax(
    xy1: BpxVector2d,
    xy2: BpxVector2d,
  ): [BpxVector2d, BpxVector2d] {
    return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
  }

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

  asArray(): [number, number] {
    return [this.x, this.y];
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): BpxVector2d {
    const m = this.magnitude();
    return new BpxVector2d(this.x / m, this.y / m);
  }

  sign(): BpxVector2d {
    return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
  }

  abs(): BpxVector2d {
    return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
  }

  floor(): BpxVector2d {
    return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
  }

  ceil(): BpxVector2d {
    return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
  }

  round(): BpxVector2d {
    return new BpxVector2d(Math.round(this.x), Math.round(this.y));
  }

  /**
   * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  toAngle(): number {
    return trigAtan2(this.x, this.y);
  }

  /** equal to */
  eq(other: BpxVector2d): boolean;
  eq(value: number): boolean;
  eq(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x === otherOrValue.x && this.y === otherOrValue.y
      : this.x === otherOrValue && this.y === otherOrValue;
  }

  /** greater than */
  gt(other: BpxVector2d): boolean;
  gt(value: number): boolean;
  gt(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x > otherOrValue.x && this.y > otherOrValue.y
      : this.x > otherOrValue && this.y > otherOrValue;
  }

  /** greater than or equal */
  gte(other: BpxVector2d): boolean;
  gte(value: number): boolean;
  gte(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x >= otherOrValue.x && this.y >= otherOrValue.y
      : this.x >= otherOrValue && this.y >= otherOrValue;
  }

  /** less than */
  lt(other: BpxVector2d): boolean;
  lt(value: number): boolean;
  lt(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x < otherOrValue.x && this.y < otherOrValue.y
      : this.x < otherOrValue && this.y < otherOrValue;
  }

  /** less than or equal */
  lte(other: BpxVector2d): boolean;
  lte(value: number): boolean;
  lte(otherOrValue: BpxVector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x <= otherOrValue.x && this.y <= otherOrValue.y
      : this.x <= otherOrValue && this.y <= otherOrValue;
  }

  clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return new BpxVector2d(
      clamp(xy1.x, this.x, xy2.x),
      clamp(xy1.y, this.y, xy2.y),
    );
  }

  /**
   * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
   */
  mod(other: BpxVector2d): BpxVector2d;
  mod(value: number): BpxVector2d;
  mod(x: number, y: number): BpxVector2d;
  mod(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number"
      ? new BpxVector2d(
          mod(this.x, otherOrValueOrX.x),
          mod(this.y, otherOrValueOrX.y),
        )
      : new BpxVector2d(
          mod(this.x, otherOrValueOrX),
          mod(this.y, maybeY ?? otherOrValueOrX),
        );
  }

  add(other: BpxVector2d): BpxVector2d;
  add(value: number): BpxVector2d;
  add(x: number, y: number): BpxVector2d;
  add(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number"
      ? new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
      : new BpxVector2d(
          this.x + otherOrValueOrX,
          this.y + (maybeY ?? otherOrValueOrX),
        );
  }

  sub(other: BpxVector2d): BpxVector2d;
  sub(value: number): BpxVector2d;
  sub(x: number, y: number): BpxVector2d;
  sub(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number"
      ? new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
      : new BpxVector2d(
          this.x - otherOrValueOrX,
          this.y - (maybeY ?? otherOrValueOrX),
        );
  }

  mul(other: BpxVector2d): BpxVector2d;
  mul(value: number): BpxVector2d;
  mul(x: number, y: number): BpxVector2d;
  mul(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number"
      ? new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
      : new BpxVector2d(
          this.x * otherOrValueOrX,
          this.y * (maybeY ?? otherOrValueOrX),
        );
  }

  div(other: BpxVector2d): BpxVector2d;
  div(value: number): BpxVector2d;
  div(x: number, y: number): BpxVector2d;
  div(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
    return typeof otherOrValueOrX !== "number"
      ? new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
      : new BpxVector2d(
          this.x / otherOrValueOrX,
          this.y / (maybeY ?? otherOrValueOrX),
        );
  }

  /////////////////////////////////////////////////////////////////////////////

  *[Symbol.iterator](): Generator<number> {
    yield this.x;
    yield this.y;
  }

  [Symbol.toPrimitive](hint: "default" | "string" | "number"): string | number {
    switch (hint) {
      case "default":
      case "string":
        return `(${this.x},${this.y})`;
      case "number":
        return NaN;
    }
  }

  get [Symbol.toStringTag]() {
    return "BpxVector2d";
  }

  __printDebug(): string {
    return `(${this.x},${this.y})`;
  }
}
