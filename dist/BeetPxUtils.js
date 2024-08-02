import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
import { offset4Directions } from "./utils/offset4Directions";
import { offset8Directions } from "./utils/offset8Directions";
import { randomElementOf } from "./utils/randomElementOf";
import { range } from "./utils/range";
import { repeatEachElement } from "./utils/repeatEachElement";
import { throwError } from "./utils/throwError";
import { trigAtan2 } from "./utils/trigAtan2";
import { trigCos } from "./utils/trigCos";
import { trigSin } from "./utils/trigSin";
export class BeetPxUtils {
    constructor() { }
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint) {
        assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint);
    }
    static booleanChangingEveryNthFrame(n, opts) {
        return booleanChangingEveryNthFrame(n, opts);
    }
    static clamp(a, b, c) {
        return clamp(a, b, c);
    }
    static drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts) {
        drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts);
    }
    static identity(param) {
        return identity(param);
    }
    static lerp(a, b, t, opts) {
        return lerp(a, b, t, opts);
    }
    static mod(value, modulus) {
        return mod(value, modulus);
    }
    static noop() { }
    static offset4Directions() {
        return offset4Directions();
    }
    static offset8Directions() {
        return offset8Directions();
    }
    static randomElementOf(array) {
        return randomElementOf(array);
    }
    static range(n) {
        return range(n);
    }
    static repeatEachElement(times, array) {
        return repeatEachElement(times, array);
    }
    static throwError(message) {
        throwError(message);
    }
    static trigAtan2(x, y) {
        return trigAtan2(x, y);
    }
    static trigCos(turnAngle) {
        return trigCos(turnAngle);
    }
    static trigSin(turnAngle) {
        return trigSin(turnAngle);
    }
}
export const $u = BeetPxUtils;
//# sourceMappingURL=BeetPxUtils.js.map