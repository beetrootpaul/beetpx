import { BpxVector2d } from "./misc/Vector2d";
import { adjacent4 } from "./utils/adjacent4";
import { adjacent8 } from "./utils/adjacent8";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
import { rand } from "./utils/rand";
import { randInt } from "./utils/randInt";
import { randOf } from "./utils/randOf";
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
    static adjacent4() {
        return adjacent4();
    }
    static adjacent8() {
        return adjacent8();
    }
    static rand(minInclusive, maxExclusive) {
        return typeof minInclusive !== "number" || typeof maxExclusive !== "number"
            ? BpxVector2d.of(rand(typeof minInclusive !== "number" ? minInclusive.x : minInclusive, typeof maxExclusive !== "number" ? maxExclusive.x : maxExclusive), rand(typeof minInclusive !== "number" ? minInclusive.y : minInclusive, typeof maxExclusive !== "number" ? maxExclusive.y : maxExclusive))
            : rand(minInclusive, maxExclusive);
    }
    static randInt(minInclusive, maxExclusive) {
        return typeof minInclusive !== "number" || typeof maxExclusive !== "number"
            ? BpxVector2d.of(randInt(typeof minInclusive !== "number" ? minInclusive.x : minInclusive, typeof maxExclusive !== "number" ? maxExclusive.x : maxExclusive), randInt(typeof minInclusive !== "number" ? minInclusive.y : minInclusive, typeof maxExclusive !== "number" ? maxExclusive.y : maxExclusive))
            : randInt(minInclusive, maxExclusive);
    }
    static randOf(array) {
        return randOf(array);
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