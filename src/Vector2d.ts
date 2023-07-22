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

  abs(): Vector2d {
    return new Vector2d(Math.abs(this.x), Math.abs(this.y));
  }

  floor(): Vector2d {
    return new Vector2d(Math.floor(this.x), Math.floor(this.y));
  }

  round(): Vector2d {
    return new Vector2d(Math.round(this.x), Math.round(this.y));
  }

  eq(other: Vector2d): boolean {
    return this.x === other.x && this.y === other.y;
  }

  gt(other: Vector2d): boolean {
    return this.x > other.x && this.y > other.y;
  }

  gte(other: Vector2d): boolean {
    return this.x >= other.x && this.y >= other.y;
  }

  lt(other: Vector2d): boolean {
    return this.x < other.x && this.y < other.y;
  }

  lte(other: Vector2d): boolean {
    return this.x <= other.x && this.y <= other.y;
  }

  clamp(xy1: Vector2d, xy2: Vector2d): Vector2d {
    return new Vector2d(
      Utils.clamp(xy1.x, this.x, xy2.x),
      Utils.clamp(xy1.y, this.y, xy2.y),
    );
  }

  mod(other: Vector2d | number): Vector2d {
    return typeof other === "number"
      ? new Vector2d(this.x % other, this.y % other)
      : new Vector2d(this.x % other.x, this.y % other.y);
  }

  add(other: Vector2d | number): Vector2d {
    return typeof other === "number"
      ? new Vector2d(this.x + other, this.y + other)
      : new Vector2d(this.x + other.x, this.y + other.y);
  }

  sub(other: Vector2d | number): Vector2d {
    return typeof other === "number"
      ? new Vector2d(this.x - other, this.y - other)
      : new Vector2d(this.x - other.x, this.y - other.y);
  }

  mul(other: Vector2d | number): Vector2d {
    return typeof other === "number"
      ? new Vector2d(this.x * other, this.y * other)
      : new Vector2d(this.x * other.x, this.y * other.y);
  }

  div(other: Vector2d | number): Vector2d {
    return typeof other === "number"
      ? new Vector2d(this.x / other, this.y / other)
      : new Vector2d(this.x / other.x, this.y / other.y);
  }

  d(): string {
    return `(${this.x},${this.y})`;
  }
}
