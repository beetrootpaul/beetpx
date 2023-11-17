
import { BpxUtils } from "../Utils";
export function v_(x, y) {
    return new BpxVector2d(x, y);
}
export class BpxVector2d {
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static unitFromAngle(turnAngle) {
        return new BpxVector2d(BpxUtils.trigCos(turnAngle), BpxUtils.trigSin(turnAngle));
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static min(xy1, xy2) {
        return new BpxVector2d(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y));
    }
    static max(xy1, xy2) {
        return new BpxVector2d(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y));
    }
    static minMax(xy1, xy2) {
        return [BpxVector2d.min(xy1, xy2), BpxVector2d.max(xy1, xy2)];
    }
    static lerp(xy1, xy2, t) {
        return new BpxVector2d(BpxUtils.lerp(xy1.x, xy2.x, t), BpxUtils.lerp(xy1.y, xy2.y, t));
    }
    asArray() {
        return [this.x, this.y];
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    sign() {
        return new BpxVector2d(Math.sign(this.x), Math.sign(this.y));
    }
    abs() {
        return new BpxVector2d(Math.abs(this.x), Math.abs(this.y));
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
    /**
     * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle() {
        return BpxUtils.trigAtan2(this.x, this.y);
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
        return new BpxVector2d(BpxUtils.clamp(xy1.x, this.x, xy2.x), BpxUtils.clamp(xy1.y, this.y, xy2.y));
    }
    mod(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(BpxUtils.mod(this.x, otherOrValueOrX.x), BpxUtils.mod(this.y, otherOrValueOrX.y))
            : new BpxVector2d(BpxUtils.mod(this.x, otherOrValueOrX), BpxUtils.mod(this.y, maybeY !== null && maybeY !== void 0 ? maybeY : otherOrValueOrX));
    }
    add(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x + otherOrValueOrX.x, this.y + otherOrValueOrX.y)
            : new BpxVector2d(this.x + otherOrValueOrX, this.y + (maybeY !== null && maybeY !== void 0 ? maybeY : otherOrValueOrX));
    }
    sub(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x - otherOrValueOrX.x, this.y - otherOrValueOrX.y)
            : new BpxVector2d(this.x - otherOrValueOrX, this.y - (maybeY !== null && maybeY !== void 0 ? maybeY : otherOrValueOrX));
    }
    mul(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x * otherOrValueOrX.x, this.y * otherOrValueOrX.y)
            : new BpxVector2d(this.x * otherOrValueOrX, this.y * (maybeY !== null && maybeY !== void 0 ? maybeY : otherOrValueOrX));
    }
    div(otherOrValueOrX, maybeY) {
        return typeof otherOrValueOrX !== "number"
            ? new BpxVector2d(this.x / otherOrValueOrX.x, this.y / otherOrValueOrX.y)
            : new BpxVector2d(this.x / otherOrValueOrX, this.y / (maybeY !== null && maybeY !== void 0 ? maybeY : otherOrValueOrX));
    }
    __printDebug() {
        return `(${this.x},${this.y})`;
    }
}
export const v_0_0_ = v_(0, 0);
export const v_1_1_ = v_(1, 1);
