// noinspection JSUnusedGlobalSymbols
import { BpxUtils } from "./Utils";
export class BpxVector2dFns {
    // export class OLD_BpxVector2d implements PrintDebug {
    // static zero = new BpxVector2d(0, 0);
    //
    // static one = new BpxVector2d(1, 1);
    //
    // static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    //   return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    // }
    static min(xy1, xy2) {
        return [Math.min(xy1[0], xy2[0]), Math.min(xy1[1], xy2[1])];
    }
    //
    // static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d {
    //   return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    // }
    static max(xy1, xy2) {
        return [Math.max(xy1[0], xy2[0]), Math.max(xy1[1], xy2[1])];
    }
    //
    // static minMax(
    //   xy1: BpxVector2d,
    //   xy2: BpxVector2d,
    // ): [BpxVector2d, BpxVector2d] {
    //   return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
    // }
    static minMax(xy1, xy2) {
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
    static unitFromAngle(turnAngle) {
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
    static forEachIntXyWithinRectOf(xy, wh, roundValues, fill, callback) {
        const [xyMinInclusive, xyMaxExclusive] = v_.minMax(roundValues ? v_.round(xy) : xy, roundValues ? v_.round(v_.add(xy, wh)) : v_.add(xy, wh));
        for (let x = xyMinInclusive[0]; x < xyMaxExclusive[0]; x += 1) {
            for (let y = xyMinInclusive[1]; y < xyMaxExclusive[1]; y += 1) {
                if (fill ||
                    x === xyMinInclusive[0] ||
                    x === xyMaxExclusive[0] - 1 ||
                    y === xyMinInclusive[1] ||
                    y === xyMaxExclusive[1] - 1) {
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
    static magnitude(xy) {
        return Math.sqrt(xy[0] * xy[0] + xy[1] * xy[1]);
    }
    //
    // TODO: cover with tests
    // sign(): BpxVector2d {
    //   return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
    // }
    static sign(xy) {
        return [Math.sign(xy[0]), Math.sign(xy[1])];
    }
    //
    // abs(): BpxVector2d {
    //   return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
    // }
    static abs(xy) {
        return [Math.abs(xy[0]), Math.abs(xy[1])];
    }
    //
    // floor(): BpxVector2d {
    //   return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
    // }
    static floor(xy) {
        return [Math.floor(xy[0]), Math.floor(xy[1])];
    }
    // ceil(): BpxVector2d {
    //   return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
    // }
    // round(): BpxVector2d {
    //   return new BpxVector2d(Math.round(this.x), Math.round(this.y));
    // }
    static round(xy) {
        return [Math.round(xy[0]), Math.round(xy[1])];
    }
    //
    // /**
    //  * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
    //  */
    // toAngle(): number {
    //   return BpxUtils.trigAtan2(this.x, this.y);
    // }
    static angleOf(xy) {
        return BpxUtils.trigAtan2(xy[0], xy[1]);
    }
    static eq(xy1, xy2) {
        return ((typeof xy1 === "number" ? xy1 : xy1[0]) ===
            (typeof xy2 === "number" ? xy2 : xy2[0]) &&
            (typeof xy1 === "number" ? xy1 : xy1[1]) ===
                (typeof xy2 === "number" ? xy2 : xy2[1]));
    }
    static gt(xy1, xy2) {
        return ((typeof xy1 === "number" ? xy1 : xy1[0]) >
            (typeof xy2 === "number" ? xy2 : xy2[0]) &&
            (typeof xy1 === "number" ? xy1 : xy1[1]) >
                (typeof xy2 === "number" ? xy2 : xy2[1]));
    }
    static gte(xy1, xy2) {
        return ((typeof xy1 === "number" ? xy1 : xy1[0]) >=
            (typeof xy2 === "number" ? xy2 : xy2[0]) &&
            (typeof xy1 === "number" ? xy1 : xy1[1]) >=
                (typeof xy2 === "number" ? xy2 : xy2[1]));
    }
    static lt(xy1, xy2) {
        return ((typeof xy1 === "number" ? xy1 : xy1[0]) <
            (typeof xy2 === "number" ? xy2 : xy2[0]) &&
            (typeof xy1 === "number" ? xy1 : xy1[1]) <
                (typeof xy2 === "number" ? xy2 : xy2[1]));
    }
    static lte(xy1, xy2) {
        return ((typeof xy1 === "number" ? xy1 : xy1[0]) <=
            (typeof xy2 === "number" ? xy2 : xy2[0]) &&
            (typeof xy1 === "number" ? xy1 : xy1[1]) <=
                (typeof xy2 === "number" ? xy2 : xy2[1]));
    }
    static mod(xy1, xy2) {
        return [
            (typeof xy1 === "number" ? xy1 : xy1[0]) %
                (typeof xy2 === "number" ? xy2 : xy2[0]),
            (typeof xy1 === "number" ? xy1 : xy1[1]) %
                (typeof xy2 === "number" ? xy2 : xy2[1]),
        ];
    }
    static add(xy1, xy2) {
        return [
            (typeof xy1 === "number" ? xy1 : xy1[0]) +
                (typeof xy2 === "number" ? xy2 : xy2[0]),
            (typeof xy1 === "number" ? xy1 : xy1[1]) +
                (typeof xy2 === "number" ? xy2 : xy2[1]),
        ];
    }
    static sub(xy1, xy2) {
        return [
            (typeof xy1 === "number" ? xy1 : xy1[0]) -
                (typeof xy2 === "number" ? xy2 : xy2[0]),
            (typeof xy1 === "number" ? xy1 : xy1[1]) -
                (typeof xy2 === "number" ? xy2 : xy2[1]),
        ];
    }
    static mul(xy1, xy2) {
        return [
            (typeof xy1 === "number" ? xy1 : xy1[0]) *
                (typeof xy2 === "number" ? xy2 : xy2[0]),
            (typeof xy1 === "number" ? xy1 : xy1[1]) *
                (typeof xy2 === "number" ? xy2 : xy2[1]),
        ];
    }
    static div(xy1, xy2) {
        return [
            (typeof xy1 === "number" ? xy1 : xy1[0]) /
                (typeof xy2 === "number" ? xy2 : xy2[0]),
            (typeof xy1 === "number" ? xy1 : xy1[1]) /
                (typeof xy2 === "number" ? xy2 : xy2[1]),
        ];
    }
}
export const v_ = BpxVector2dFns;
export function v2d_(x, y) {
    return [x, y];
}
