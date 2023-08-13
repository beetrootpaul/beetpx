"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2d = exports.v_ = void 0;
const Utils_1 = require("./Utils");
function v_(x, y) {
    return new Vector2d(x, y);
}
exports.v_ = v_;
class Vector2d {
    static min(xy1, xy2) {
        return new Vector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    }
    static max(xy1, xy2) {
        return new Vector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    }
    static minMax(xy1, xy2) {
        return [Vector2d.min(xy1, xy2), Vector2d.max(xy1, xy2)];
    }
    static forEachIntXyWithinRectOf(xy, wh, fill, callback) {
        xy = xy.round();
        wh = wh.round();
        const [xyMinInclusive, xyMaxExclusive] = Vector2d.minMax(xy, xy.add(wh));
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
            for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
                if (fill ||
                    x === xyMinInclusive.x ||
                    x === xyMaxExclusive.x - 1 ||
                    y === xyMinInclusive.y ||
                    y === xyMaxExclusive.y - 1) {
                    callback(v_(x, y));
                }
            }
        }
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    asArray() {
        return [this.x, this.y];
    }
    // TODO: cover with tests
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    // TODO: cover with tests
    sign() {
        return new Vector2d(Math.sign(this.x), Math.sign(this.y));
    }
    abs() {
        return new Vector2d(Math.abs(this.x), Math.abs(this.y));
    }
    floor() {
        return new Vector2d(Math.floor(this.x), Math.floor(this.y));
    }
    round() {
        return new Vector2d(Math.round(this.x), Math.round(this.y));
    }
    eq(otherOrValue) {
        return typeof otherOrValue !== "number"
            ? this.x === otherOrValue.x && this.y === otherOrValue.y
            : this.x === otherOrValue && this.y === otherOrValue;
    }
    gt(otherOrValue) {
        return typeof otherOrValue !== "number"
            ? this.x > otherOrValue.x && this.y > otherOrValue.y
            : this.x > otherOrValue && this.y > otherOrValue;
    }
    gte(otherOrValue) {
        return typeof otherOrValue !== "number"
            ? this.x >= otherOrValue.x && this.y >= otherOrValue.y
            : this.x >= otherOrValue && this.y >= otherOrValue;
    }
    lt(otherOrValue) {
        return typeof otherOrValue !== "number"
            ? this.x < otherOrValue.x && this.y < otherOrValue.y
            : this.x < otherOrValue && this.y < otherOrValue;
    }
    lte(otherOrValue) {
        return typeof otherOrValue !== "number"
            ? this.x <= otherOrValue.x && this.y <= otherOrValue.y
            : this.x <= otherOrValue && this.y <= otherOrValue;
    }
    clamp(xy1, xy2) {
        return new Vector2d(Utils_1.Utils.clamp(xy1.x, this.x, xy2.x), Utils_1.Utils.clamp(xy1.y, this.y, xy2.y));
    }
    mod(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new Vector2d(this.x % otherOrValueOrX.x, this.y % otherOrValueOrX.y)
            : new Vector2d(this.x % otherOrValueOrX, this.y % (maybeY ?? otherOrValueOrX));
    }
    add(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new Vector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
            : new Vector2d(this.x + otherOrValueOrX, this.y + (maybeY ?? otherOrValueOrX));
    }
    sub(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new Vector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
            : new Vector2d(this.x - otherOrValueOrX, this.y - (maybeY ?? otherOrValueOrX));
    }
    mul(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new Vector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
            : new Vector2d(this.x * otherOrValueOrX, this.y * (maybeY ?? otherOrValueOrX));
    }
    div(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new Vector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
            : new Vector2d(this.x / otherOrValueOrX, this.y / (maybeY ?? otherOrValueOrX));
    }
    d() {
        return `(${this.x},${this.y})`;
    }
}
exports.Vector2d = Vector2d;
Vector2d.zero = new Vector2d(0, 0);
