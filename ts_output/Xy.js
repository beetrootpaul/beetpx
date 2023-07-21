"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xy = exports.xy_ = void 0;
const Utils_1 = require("./Utils");
// TODO: Consider Vector2d and v_
function xy_(x, y) {
    return new Xy(x, y);
}
exports.xy_ = xy_;
class Xy {
    static min(xy1, xy2) {
        return new Xy(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    }
    static max(xy1, xy2) {
        return new Xy(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    }
    static forEachIntXyWithinRectOf(xy1, xy2, fill, callback) {
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
                if (fill ||
                    x === xMinInclusive ||
                    x === xMaxExclusive - 1 ||
                    y === yMinInclusive ||
                    y === yMaxExclusive - 1) {
                    callback(xy_(x, y));
                }
            }
        }
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // TODO: cover with tests
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    abs() {
        return new Xy(Math.abs(this.x), Math.abs(this.y));
    }
    floor() {
        return new Xy(Math.floor(this.x), Math.floor(this.y));
    }
    round() {
        return new Xy(Math.round(this.x), Math.round(this.y));
    }
    eq(other) {
        return this.x === other.x && this.y === other.y;
    }
    gt(other) {
        return this.x > other.x && this.y > other.y;
    }
    gte(other) {
        return this.x >= other.x && this.y >= other.y;
    }
    lt(other) {
        return this.x < other.x && this.y < other.y;
    }
    lte(other) {
        return this.x <= other.x && this.y <= other.y;
    }
    clamp(xy1, xy2) {
        return new Xy(Utils_1.Utils.clamp(xy1.x, this.x, xy2.x), Utils_1.Utils.clamp(xy1.y, this.y, xy2.y));
    }
    mod(other) {
        return typeof other === "number"
            ? new Xy(this.x % other, this.y % other)
            : new Xy(this.x % other.x, this.y % other.y);
    }
    add(other) {
        return typeof other === "number"
            ? new Xy(this.x + other, this.y + other)
            : new Xy(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return typeof other === "number"
            ? new Xy(this.x - other, this.y - other)
            : new Xy(this.x - other.x, this.y - other.y);
    }
    mul(other) {
        return typeof other === "number"
            ? new Xy(this.x * other, this.y * other)
            : new Xy(this.x * other.x, this.y * other.y);
    }
    div(other) {
        return typeof other === "number"
            ? new Xy(this.x / other, this.y / other)
            : new Xy(this.x / other.x, this.y / other.y);
    }
    d() {
        return `(${this.x},${this.y})`;
    }
}
exports.Xy = Xy;
Xy.zero = new Xy(0, 0);
