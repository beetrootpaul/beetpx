import { PrintDebug } from "./debug/PrintDebug";
import { Utils } from "./Utils";

// TODO: Consider Vector2d and v_

export function xy_(x: number, y: number): Xy {
  return new Xy(x, y);
}

export class Xy implements PrintDebug {
  static zero = new Xy(0, 0);

  static min(xy1: Xy, xy2: Xy): Xy {
    return new Xy(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
  }

  static max(xy1: Xy, xy2: Xy): Xy {
    return new Xy(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
  }

  static forEachIntXyWithinRectOf(
    xy1: Xy,
    xy2: Xy,
    fill: boolean,
    callback: (xy: Xy) => void,
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
          callback(xy_(x, y));
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

  abs(): Xy {
    return new Xy(Math.abs(this.x), Math.abs(this.y));
  }

  floor(): Xy {
    return new Xy(Math.floor(this.x), Math.floor(this.y));
  }

  round(): Xy {
    return new Xy(Math.round(this.x), Math.round(this.y));
  }

  eq(other: Xy): boolean {
    return this.x === other.x && this.y === other.y;
  }

  gt(other: Xy): boolean {
    return this.x > other.x && this.y > other.y;
  }

  gte(other: Xy): boolean {
    return this.x >= other.x && this.y >= other.y;
  }

  lt(other: Xy): boolean {
    return this.x < other.x && this.y < other.y;
  }

  lte(other: Xy): boolean {
    return this.x <= other.x && this.y <= other.y;
  }

  clamp(xy1: Xy, xy2: Xy): Xy {
    return new Xy(
      Utils.clamp(xy1.x, this.x, xy2.x),
      Utils.clamp(xy1.y, this.y, xy2.y),
    );
  }

  mod(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x % other, this.y % other)
      : new Xy(this.x % other.x, this.y % other.y);
  }

  add(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x + other, this.y + other)
      : new Xy(this.x + other.x, this.y + other.y);
  }

  sub(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x - other, this.y - other)
      : new Xy(this.x - other.x, this.y - other.y);
  }

  mul(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x * other, this.y * other)
      : new Xy(this.x * other.x, this.y * other.y);
  }

  div(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x / other, this.y / other)
      : new Xy(this.x / other.x, this.y / other.y);
  }

  d(): string {
    return `(${this.x},${this.y})`;
  }
}
