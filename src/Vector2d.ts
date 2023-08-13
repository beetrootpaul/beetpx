// noinspection JSUnusedGlobalSymbols

import { PrintDebug } from "./debug/PrintDebug";
import { Utils } from "./Utils";

export function v_(x: number, y: number): Vector2d {
  return new Vector2d(x, y);
}

export class Vector2d implements PrintDebug {
  static zero = new Vector2d(0, 0);

  static min(xy1: Vector2d, xy2: Vector2d): Vector2d {
    return new Vector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
  }

  static max(xy1: Vector2d, xy2: Vector2d): Vector2d {
    return new Vector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
  }

  static forEachIntXyWithinRectOf(
    xy1: Vector2d,
    xy2: Vector2d,
    fill: boolean,
    callback: (xy: Vector2d) => void,
  ): void {
    xy1 = xy1.round();
    xy2 = xy2.round();
    const [xMinInclusive, xMaxExclusive] = [
      Math.min(xy1.x, xy2.x),
      Math.max(xy1.x, xy2.x),
    ];
    const [yMinInclusive, yMaxExclusive] = [
      Math.min(xy1.y, xy2.y),
      Math.max(xy1.y, xy2.y),
    ];
    for (let x = xMinInclusive; x < xMaxExclusive; x += 1) {
      for (let y = yMinInclusive; y < yMaxExclusive; y += 1) {
        if (
          fill ||
          x === xMinInclusive ||
          x === xMaxExclusive - 1 ||
          y === yMinInclusive ||
          y === yMaxExclusive - 1
        ) {
          callback(v_(x, y));
        }
      }
    }
  }

  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // TODO: cover with tests
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // TODO: cover with tests
  sign(): Vector2d {
    return new Vector2d(Math.sign(this.x), Math.sign(this.y));
  }

  abs(): Vector2d {
    return new Vector2d(Math.abs(this.x), Math.abs(this.y));
  }

  floor(): Vector2d {
    return new Vector2d(Math.floor(this.x), Math.floor(this.y));
  }

  round(): Vector2d {
    return new Vector2d(Math.round(this.x), Math.round(this.y));
  }

  eq(other: Vector2d): boolean;
  eq(value: number): boolean;
  eq(otherOrValue: Vector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x === otherOrValue.x && this.y === otherOrValue.y
      : this.x === otherOrValue && this.y === otherOrValue;
  }

  gt(other: Vector2d): boolean;
  gt(value: number): boolean;
  gt(otherOrValue: Vector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x > otherOrValue.x && this.y > otherOrValue.y
      : this.x > otherOrValue && this.y > otherOrValue;
  }

  gte(other: Vector2d): boolean;
  gte(value: number): boolean;
  gte(otherOrValue: Vector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x >= otherOrValue.x && this.y >= otherOrValue.y
      : this.x >= otherOrValue && this.y >= otherOrValue;
  }

  lt(other: Vector2d): boolean;
  lt(value: number): boolean;
  lt(otherOrValue: Vector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x < otherOrValue.x && this.y < otherOrValue.y
      : this.x < otherOrValue && this.y < otherOrValue;
  }

  lte(other: Vector2d): boolean;
  lte(value: number): boolean;
  lte(otherOrValue: Vector2d | number): boolean {
    return typeof otherOrValue !== "number"
      ? this.x <= otherOrValue.x && this.y <= otherOrValue.y
      : this.x <= otherOrValue && this.y <= otherOrValue;
  }

  clamp(xy1: Vector2d, xy2: Vector2d): Vector2d {
    return new Vector2d(
      Utils.clamp(xy1.x, this.x, xy2.x),
      Utils.clamp(xy1.y, this.y, xy2.y),
    );
  }

  mod(other: Vector2d): Vector2d;
  mod(value: number): Vector2d;
  mod(x: number, y: number): Vector2d;
  mod(otherOrValueOrX: Vector2d | number, maybeY?: number): Vector2d {
    return typeof otherOrValueOrX !== "number"
      ? new Vector2d(this.x % otherOrValueOrX.x, this.y % otherOrValueOrX.y)
      : new Vector2d(
          this.x % otherOrValueOrX,
          this.y % (maybeY ?? otherOrValueOrX),
        );
  }

  add(other: Vector2d): Vector2d;
  add(value: number): Vector2d;
  add(x: number, y: number): Vector2d;
  add(otherOrValueOrX: Vector2d | number, maybeY?: number): Vector2d {
    return typeof otherOrValueOrX !== "number"
      ? new Vector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
      : new Vector2d(
          this.x + otherOrValueOrX,
          this.y + (maybeY ?? otherOrValueOrX),
        );
  }

  sub(other: Vector2d): Vector2d;
  sub(value: number): Vector2d;
  sub(x: number, y: number): Vector2d;
  sub(otherOrValueOrX: Vector2d | number, maybeY?: number): Vector2d {
    return typeof otherOrValueOrX !== "number"
      ? new Vector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
      : new Vector2d(
          this.x - otherOrValueOrX,
          this.y - (maybeY ?? otherOrValueOrX),
        );
  }

  mul(other: Vector2d): Vector2d;
  mul(value: number): Vector2d;
  mul(x: number, y: number): Vector2d;
  mul(otherOrValueOrX: Vector2d | number, maybeY?: number): Vector2d {
    return typeof otherOrValueOrX !== "number"
      ? new Vector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
      : new Vector2d(
          this.x * otherOrValueOrX,
          this.y * (maybeY ?? otherOrValueOrX),
        );
  }

  div(other: Vector2d): Vector2d;
  div(value: number): Vector2d;
  div(x: number, y: number): Vector2d;
  div(otherOrValueOrX: Vector2d | number, maybeY?: number): Vector2d {
    return typeof otherOrValueOrX !== "number"
      ? new Vector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
      : new Vector2d(
          this.x / otherOrValueOrX,
          this.y / (maybeY ?? otherOrValueOrX),
        );
  }

  d(): string {
    return `(${this.x},${this.y})`;
  }
}
