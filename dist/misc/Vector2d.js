import { clamp } from "../utils/clamp";
import { lerp } from "../utils/lerp";
import { mod } from "../utils/mod";
import { trigAtan2 } from "../utils/trigAtan2";
import { trigCos } from "../utils/trigCos";
import { trigSin } from "../utils/trigSin";
export class BpxVector2d {
    x;
    y;
    static unitFromAngle(turnAngle) {
        return new BpxVector2d(trigCos(turnAngle), trigSin(turnAngle));
    }
    static of(valueOrX, maybeY) {
        return new BpxVector2d(valueOrX, maybeY ?? valueOrX);
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static minOf(xy1, xy2) {
        return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    }
    static maxOf(xy1, xy2) {
        return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    }
    static minMaxOf(xy1, xy2) {
        return [BpxVector2d.minOf(xy1, xy2), BpxVector2d.maxOf(xy1, xy2)];
    }
    static lerp(xy1, xy2, t, opts) {
        return new BpxVector2d(lerp(xy1.x, xy2.x, t, opts), lerp(xy1.y, xy2.y, t, opts));
    }
    asArray() {
        return [this.x, this.y];
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        if (this.x === 0 && this.y === 0)
            return new BpxVector2d(0, 0);
        const m = this.magnitude();
        return new BpxVector2d(this.x / m, this.y / m);
    }
    sign() {
        return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
    }
    abs() {
        return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
    }
    neg() {
        return new BpxVector2d(this.x === 0 ? 0 : -this.x, this.y === 0 ? 0 : -this.y);
    }
    floor() {
        return new BpxVector2d(Math.floor(this.x), Math.floor(this.y));
    }
    ceil() {
        return new BpxVector2d(Math.ceil(this.x), Math.ceil(this.y));
    }
    round() {
        return new BpxVector2d(Math.round(this.x), Math.round(this.y));
    }
    toAngle() {
        return trigAtan2(this.x, this.y);
    }
    eq(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? this.x === otherOrValueOrX.x && this.y === otherOrValueOrX.y
            : this.x === otherOrValueOrX && this.y === (maybeY ?? otherOrValueOrX);
    }
    gt(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? this.x > otherOrValueOrX.x && this.y > otherOrValueOrX.y
            : this.x > otherOrValueOrX && this.y > (maybeY ?? otherOrValueOrX);
    }
    gte(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? this.x >= otherOrValueOrX.x && this.y >= otherOrValueOrX.y
            : this.x >= otherOrValueOrX && this.y >= (maybeY ?? otherOrValueOrX);
    }
    lt(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? this.x < otherOrValueOrX.x && this.y < otherOrValueOrX.y
            : this.x < otherOrValueOrX && this.y < (maybeY ?? otherOrValueOrX);
    }
    lte(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? this.x <= otherOrValueOrX.x && this.y <= otherOrValueOrX.y
            : this.x <= otherOrValueOrX && this.y <= (maybeY ?? otherOrValueOrX);
    }
    clamp(xy1, xy2) {
        return new BpxVector2d(clamp(xy1.x, this.x, xy2.x), clamp(xy1.y, this.y, xy2.y));
    }
    mod(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(mod(this.x, otherOrValueOrX.x), mod(this.y, otherOrValueOrX.y))
            : new BpxVector2d(mod(this.x, otherOrValueOrX), mod(this.y, maybeY ?? otherOrValueOrX));
    }
    add(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
            : new BpxVector2d(this.x + otherOrValueOrX, this.y + (maybeY ?? otherOrValueOrX));
    }
    sub(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
            : new BpxVector2d(this.x - otherOrValueOrX, this.y - (maybeY ?? otherOrValueOrX));
    }
    mul(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
            : new BpxVector2d(this.x * otherOrValueOrX, this.y * (maybeY ?? otherOrValueOrX));
    }
    div(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
            : new BpxVector2d(this.x / otherOrValueOrX, this.y / (maybeY ?? otherOrValueOrX));
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    [Symbol.toPrimitive](hint) {
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
    __printDebug() {
        return `(${this.x},${this.y})`;
    }
}
//# sourceMappingURL=Vector2d.js.map