// noinspection JSUnusedGlobalSymbols

import { BpxUtils } from "./Utils";

export type BpxVector2d = readonly [number, number];

export class BpxVector2dFns {
  // export class OLD_BpxVector2d implements PrintDebug {
  // static zero = new BpxVector2d(0, 0);
  //
  // static one = new BpxVector2d(1, 1);
  //
  // static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
  //   return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
  // }
  static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return [Math.min(xy1[0], xy2[0]), Math.min(xy1[1], xy2[1])];
  }
  //
  // static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
  //   return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
  // }
  static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    return [Math.max(xy1[0], xy2[0]), Math.max(xy1[1], xy2[1])];
  }
  //
  // static minMax(
  //   xy1: BpxVector2d,
  //   xy2: BpxVector2d,
  // ): [BpxVector2d, BpxVector2d] {
  //   return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
  // }
  static minMax(
    xy1: BpxVector2d,
    xy2: BpxVector2d,
  ): [BpxVector2d, BpxVector2d] {
    return [v_.min(xy1, xy2), v_.max(xy1, xy2)];
  }
  //
  // static lerp(xy1: BpxVector2d, xy2: BpxVector2d, t: number): BpxVector2d {
  //   return new BpxVector2d(
  //     BpxUtils.lerp(xy1.x, xy2.x, t),
  //     BpxUtils.lerp(xy1.y, xy2.y, t),
  //   );
  // }
  //
  // /**
  //  * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
  //  */
  // static unitFromAngle(turnAngle: number): BpxVector2d {
  //   return new BpxVector2d(
  //     BpxUtils.trigCos(turnAngle),
  //     BpxUtils.trigSin(turnAngle),
  //   );
  // }
  static unitFromAngle(turnAngle: number): BpxVector2d {
    return [BpxUtils.trigCos(turnAngle), BpxUtils.trigSin(turnAngle)];
  }
  //
  // TODO: sounds like something to mover outside the basic set of fns in Vector2d
  // static forEachIntXyWithinRectOf(
  //   xy: BpxVector2d,
  //   wh: BpxVector2d,
  //   roundValues: boolean,
  //   fill: boolean,
  //   callback: (xy: BpxVector2d) => void,
  // ): void {
  //   const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
  //     roundValues ? xy.round() : xy,
  //     roundValues ? xy.add(wh).round() : xy.add(wh),
  //   );
  //   for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
  //     for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
  //       if (
  //         fill ||
  //         x === xyMinInclusive.x ||
  //         x === xyMaxExclusive.x - 1 ||
  //         y === xyMinInclusive.y ||
  //         y === xyMaxExclusive.y - 1
  //       ) {
  //         callback(v_(x, y));
  //       }
  //     }
  //   }
  // }
  static forEachIntXyWithinRectOf(
    xy: BpxVector2d,
    wh: BpxVector2d,
    roundValues: boolean,
    fill: boolean,
    callback: (xy: BpxVector2d) => void,
  ): void {
    const [xyMinInclusive, xyMaxExclusive] = v_.minMax(
      roundValues ? v_.round(xy) : xy,
      roundValues ? v_.round(v_.add(xy, wh)) : v_.add(xy, wh),
    );
    for (let x = xyMinInclusive[0]; x < xyMaxExclusive[0]; x += 1) {
      for (let y = xyMinInclusive[1]; y < xyMaxExclusive[1]; y += 1) {
        if (
          fill ||
          x === xyMinInclusive[0] ||
          x === xyMaxExclusive[0] - 1 ||
          y === xyMinInclusive[1] ||
          y === xyMaxExclusive[1] - 1
        ) {
          callback(v2d_(x, y));
        }
      }
    }
  }
  //
  // readonly x: number;
  // readonly y: number;
  //
  // constructor(x: number, y: number) {
  //   this.x = x;
  //   this.y = y;
  // }
  //
  // asArray(): [number, number] {
  //   return [this.x, this.y];
  // }
  //
  // TODO: cover with tests
  // magnitude(): number {
  //   return Math.sqrt(this.x * this.x + this.y * this.y);
  // }
  static magnitude(xy: BpxVector2d): number {
    return Math.sqrt(xy[0] * xy[0] + xy[1] * xy[1]);
  }
  //
  // TODO: cover with tests
  // sign(): BpxVector2d {
  //   return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
  // }
  static sign(xy: BpxVector2d): BpxVector2d {
    return [Math.sign(xy[0]), Math.sign(xy[1])];
  }
  //
  // abs(): BpxVector2d {
  //   return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
  // }
  static abs(xy: BpxVector2d): BpxVector2d {
    return [Math.abs(xy[0]), Math.abs(xy[1])];
  }
  //
  // floor(): BpxVector2d {
  //   return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
  // }
  static floor(xy: BpxVector2d): BpxVector2d {
    return [Math.floor(xy[0]), Math.floor(xy[1])];
  }
  // ceil(): BpxVector2d {
  //   return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
  // }
  // round(): BpxVector2d {
  //   return new BpxVector2d(Math.round(this.x), Math.round(this.y));
  // }
  static round(xy: BpxVector2d): BpxVector2d {
    return [Math.round(xy[0]), Math.round(xy[1])];
  }
  //
  // /**
  //  * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
  //  */
  // toAngle(): number {
  //   return BpxUtils.trigAtan2(this.x, this.y);
  // }
  static angleOf(xy: BpxVector2d): number {
    return BpxUtils.trigAtan2(xy[0], xy[1]);
  }
  //
  // eq(other: BpxVector2d): boolean;
  // eq(value: number): boolean;
  // eq(otherOrValue: BpxVector2d | number): boolean {
  //   return typeof otherOrValue !== "number"
  //     ? this.x === otherOrValue.x && this.y === otherOrValue.y
  //     : this.x === otherOrValue && this.y === otherOrValue;
  // }
  static eq(xy1: BpxVector2d, xy2: BpxVector2d): boolean;
  static eq(value: number, xy2: BpxVector2d): boolean;
  static eq(xy1: BpxVector2d, value: number): boolean;
  static eq(xy1: BpxVector2d | number, xy2: BpxVector2d | number): boolean {
    return (
      (typeof xy1 === "number" ? xy1 : xy1[0]) ===
        (typeof xy2 === "number" ? xy2 : xy2[0]) &&
      (typeof xy1 === "number" ? xy1 : xy1[1]) ===
        (typeof xy2 === "number" ? xy2 : xy2[1])
    );
  }
  //
  // gt(other: BpxVector2d): boolean;
  // gt(value: number): boolean;
  // gt(otherOrValue: BpxVector2d | number): boolean {
  //   return typeof otherOrValue !== "number"
  //     ? this.x > otherOrValue.x && this.y > otherOrValue.y
  //     : this.x > otherOrValue && this.y > otherOrValue;
  // }
  static gt(xy1: BpxVector2d, xy2: BpxVector2d): boolean;
  static gt(value: number, xy2: BpxVector2d): boolean;
  static gt(xy1: BpxVector2d, value: number): boolean;
  static gt(xy1: BpxVector2d | number, xy2: BpxVector2d | number): boolean {
    return (
      (typeof xy1 === "number" ? xy1 : xy1[0]) >
        (typeof xy2 === "number" ? xy2 : xy2[0]) &&
      (typeof xy1 === "number" ? xy1 : xy1[1]) >
        (typeof xy2 === "number" ? xy2 : xy2[1])
    );
  }
  //
  // gte(other: BpxVector2d): boolean;
  // gte(value: number): boolean;
  // gte(otherOrValue: BpxVector2d | number): boolean {
  //   return typeof otherOrValue !== "number"
  //     ? this.x >= otherOrValue.x && this.y >= otherOrValue.y
  //     : this.x >= otherOrValue && this.y >= otherOrValue;
  // }
  static gte(xy1: BpxVector2d, xy2: BpxVector2d): boolean;
  static gte(value: number, xy2: BpxVector2d): boolean;
  static gte(xy1: BpxVector2d, value: number): boolean;
  static gte(xy1: BpxVector2d | number, xy2: BpxVector2d | number): boolean {
    return (
      (typeof xy1 === "number" ? xy1 : xy1[0]) >=
        (typeof xy2 === "number" ? xy2 : xy2[0]) &&
      (typeof xy1 === "number" ? xy1 : xy1[1]) >=
        (typeof xy2 === "number" ? xy2 : xy2[1])
    );
  }
  //
  // lt(other: BpxVector2d): boolean;
  // lt(value: number): boolean;
  // lt(otherOrValue: BpxVector2d | number): boolean {
  //   return typeof otherOrValue !== "number"
  //     ? this.x < otherOrValue.x && this.y < otherOrValue.y
  //     : this.x < otherOrValue && this.y < otherOrValue;
  // }
  static lt(xy1: BpxVector2d, xy2: BpxVector2d): boolean;
  static lt(value: number, xy2: BpxVector2d): boolean;
  static lt(xy1: BpxVector2d, value: number): boolean;
  static lt(xy1: BpxVector2d | number, xy2: BpxVector2d | number): boolean {
    return (
      (typeof xy1 === "number" ? xy1 : xy1[0]) <
        (typeof xy2 === "number" ? xy2 : xy2[0]) &&
      (typeof xy1 === "number" ? xy1 : xy1[1]) <
        (typeof xy2 === "number" ? xy2 : xy2[1])
    );
  }
  //
  // lte(other: BpxVector2d): boolean;
  // lte(value: number): boolean;
  // lte(otherOrValue: BpxVector2d | number): boolean {
  //   return typeof otherOrValue !== "number"
  //     ? this.x <= otherOrValue.x && this.y <= otherOrValue.y
  //     : this.x <= otherOrValue && this.y <= otherOrValue;
  // }
  static lte(xy1: BpxVector2d, xy2: BpxVector2d): boolean;
  static lte(value: number, xy2: BpxVector2d): boolean;
  static lte(xy1: BpxVector2d, value: number): boolean;
  static lte(xy1: BpxVector2d | number, xy2: BpxVector2d | number): boolean {
    return (
      (typeof xy1 === "number" ? xy1 : xy1[0]) <=
        (typeof xy2 === "number" ? xy2 : xy2[0]) &&
      (typeof xy1 === "number" ? xy1 : xy1[1]) <=
        (typeof xy2 === "number" ? xy2 : xy2[1])
    );
  }
  //
  // clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
  //   return new BpxVector2d(
  //     BpxUtils.clamp(xy1.x, this.x, xy2.x),
  //     BpxUtils.clamp(xy1.y, this.y, xy2.y),
  //   );
  // }
  //
  // mod(other: BpxVector2d): BpxVector2d;
  // mod(value: number): BpxVector2d;
  // mod(x: number, y: number): BpxVector2d;
  // mod(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
  //   return typeof otherOrValueOrX !== "number"
  //     ? new BpxVector2d(this.x % otherOrValueOrX.x, this.y % otherOrValueOrX.y)
  //     : new BpxVector2d(
  //         this.x % otherOrValueOrX,
  //         this.y % (maybeY ?? otherOrValueOrX),
  //       );
  // }
  static mod(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
  static mod(value: number, xy2: BpxVector2d): BpxVector2d;
  static mod(xy1: BpxVector2d, value: number): BpxVector2d;
  static mod(
    xy1: BpxVector2d | number,
    xy2: BpxVector2d | number,
  ): BpxVector2d {
    return [
      (typeof xy1 === "number" ? xy1 : xy1[0]) %
        (typeof xy2 === "number" ? xy2 : xy2[0]),
      (typeof xy1 === "number" ? xy1 : xy1[1]) %
        (typeof xy2 === "number" ? xy2 : xy2[1]),
    ];
  }
  //
  // add(other: BpxVector2d): BpxVector2d;
  // add(value: number): BpxVector2d;
  // add(x: number, y: number): BpxVector2d;
  // add(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
  //   return typeof otherOrValueOrX !== "number"
  //     ? new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
  //     : new BpxVector2d(
  //         this.x + otherOrValueOrX,
  //         this.y + (maybeY ?? otherOrValueOrX),
  //       );
  // }
  static add(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
  static add(value: number, xy2: BpxVector2d): BpxVector2d;
  static add(xy1: BpxVector2d, value: number): BpxVector2d;
  static add(
    xy1: BpxVector2d | number,
    xy2: BpxVector2d | number,
  ): BpxVector2d {
    return [
      (typeof xy1 === "number" ? xy1 : xy1[0]) +
        (typeof xy2 === "number" ? xy2 : xy2[0]),
      (typeof xy1 === "number" ? xy1 : xy1[1]) +
        (typeof xy2 === "number" ? xy2 : xy2[1]),
    ];
  }
  //
  // sub(other: BpxVector2d): BpxVector2d;
  // sub(value: number): BpxVector2d;
  // sub(x: number, y: number): BpxVector2d;
  // sub(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
  //   return typeof otherOrValueOrX !== "number"
  //     ? new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
  //     : new BpxVector2d(
  //         this.x - otherOrValueOrX,
  //         this.y - (maybeY ?? otherOrValueOrX),
  //       );
  // }
  static sub(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
  static sub(value: number, xy2: BpxVector2d): BpxVector2d;
  static sub(xy1: BpxVector2d, value: number): BpxVector2d;
  static sub(
    xy1: BpxVector2d | number,
    xy2: BpxVector2d | number,
  ): BpxVector2d {
    return [
      (typeof xy1 === "number" ? xy1 : xy1[0]) -
        (typeof xy2 === "number" ? xy2 : xy2[0]),
      (typeof xy1 === "number" ? xy1 : xy1[1]) -
        (typeof xy2 === "number" ? xy2 : xy2[1]),
    ];
  }
  //
  // mul(other: BpxVector2d): BpxVector2d;
  // mul(value: number): BpxVector2d;
  // mul(x: number, y: number): BpxVector2d;
  // mul(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
  //   return typeof otherOrValueOrX !== "number"
  //     ? new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
  //     : new BpxVector2d(
  //         this.x * otherOrValueOrX,
  //         this.y * (maybeY ?? otherOrValueOrX),
  //       );
  // }
  static mul(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
  static mul(value: number, xy2: BpxVector2d): BpxVector2d;
  static mul(xy1: BpxVector2d, value: number): BpxVector2d;
  static mul(
    xy1: BpxVector2d | number,
    xy2: BpxVector2d | number,
  ): BpxVector2d {
    return [
      (typeof xy1 === "number" ? xy1 : xy1[0]) *
        (typeof xy2 === "number" ? xy2 : xy2[0]),
      (typeof xy1 === "number" ? xy1 : xy1[1]) *
        (typeof xy2 === "number" ? xy2 : xy2[1]),
    ];
  }
  //
  // div(other: BpxVector2d): BpxVector2d;
  // div(value: number): BpxVector2d;
  // div(x: number, y: number): BpxVector2d;
  // div(otherOrValueOrX: BpxVector2d | number, maybeY?: number): BpxVector2d {
  //   return typeof otherOrValueOrX !== "number"
  //     ? new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
  //     : new BpxVector2d(
  //         this.x / otherOrValueOrX,
  //         this.y / (maybeY ?? otherOrValueOrX),
  //       );
  // }
  static div(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
  static div(value: number, xy2: BpxVector2d): BpxVector2d;
  static div(xy1: BpxVector2d, value: number): BpxVector2d;
  static div(
    xy1: BpxVector2d | number,
    xy2: BpxVector2d | number,
  ): BpxVector2d {
    return [
      (typeof xy1 === "number" ? xy1 : xy1[0]) /
        (typeof xy2 === "number" ? xy2 : xy2[0]),
      (typeof xy1 === "number" ? xy1 : xy1[1]) /
        (typeof xy2 === "number" ? xy2 : xy2[1]),
    ];
  }
  //
  // __printDebug(): string {
  //   return `(${this.x},${this.y})`;
  // }
  // }
}

export const v_ = BpxVector2dFns;

export function v2d_(x: number, y: number): BpxVector2d {
  return [x, y];
}
