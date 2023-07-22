"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2d = exports.v_ = void 0;
const Utils_1 = require("./Utils");
// TODO: Consider Vector2d and v_
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
                    callback(v_(x, y));
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
        return new Vector2d(Math.abs(this.x), Math.abs(this.y));
    }
    floor() {
        return new Vector2d(Math.floor(this.x), Math.floor(this.y));
    }
    round() {
        return new Vector2d(Math.round(this.x), Math.round(this.y));
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
        return new Vector2d(Utils_1.Utils.clamp(xy1.x, this.x, xy2.x), Utils_1.Utils.clamp(xy1.y, this.y, xy2.y));
    }
    mod(other) {
        return typeof other === "number"
            ? new Vector2d(this.x % other, this.y % other)
            : new Vector2d(this.x % other.x, this.y % other.y);
    }
    add(other) {
        return typeof other === "number"
            ? new Vector2d(this.x + other, this.y + other)
            : new Vector2d(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return typeof other === "number"
            ? new Vector2d(this.x - other, this.y - other)
            : new Vector2d(this.x - other.x, this.y - other.y);
    }
    mul(other) {
        return typeof other === "number"
            ? new Vector2d(this.x * other, this.y * other)
            : new Vector2d(this.x * other.x, this.y * other.y);
    }
    div(other) {
        return typeof other === "number"
            ? new Vector2d(this.x / other, this.y / other)
            : new Vector2d(this.x / other.x, this.y / other.y);
    }
    d() {
        return `(${this.x},${this.y})`;
    }
}
exports.Vector2d = Vector2d;
Vector2d.zero = new Vector2d(0, 0);
