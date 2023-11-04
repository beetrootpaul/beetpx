// noinspection JSUnusedGlobalSymbols
import { BeetPx } from "./BeetPx";
import { BpxVector2d, v_, v_0_0_ } from "./Vector2d";
// TODO: consider exposing those utils as BeetPx global API methods
export class BpxUtils {
    /**
     * NOTE: This function makes sense in a TypeScript codebase only.
     *
     * This function is meant to be used in a last branch of `if - else if - … - else`
     *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
     *   a union type of which we check all possible cases. Someday we add one more
     *   type to the union, but we forget to extend our `switch` by that one more `case`.
     *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     *   will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
     */
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint) {
        throw Error("Somehow reached the unreachable code. Was TypeScript checker run on it?");
    }
    // TODO: tests for edge cases
    static booleanChangingEveryNthFrame(n) {
        return BeetPx.frameNumber % (n * 2) < n;
    }
    // Returns the middle number. Example usage: `clamp(min, value, max)`
    //   in order to find a value which is:
    //   - `value` if it is `>= min` and `<= max`
    //   - `min` if `value` is `< min`
    //   - `max` if `value` is `> max`
    static clamp(a, b, c) {
        return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
    }
    static identity(param) {
        return param;
    }
    static isDefined(value) {
        return value != null;
    }
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
    static measureText(text) {
        var _a, _b;
        const charSprites = (_b = (_a = BeetPx.getFont()) === null || _a === void 0 ? void 0 : _a.spritesFor(text)) !== null && _b !== void 0 ? _b : [];
        let size = v_0_0_;
        for (const charSprite of charSprites) {
            size = BpxVector2d.max(size, charSprite.positionInText.add(charSprite.sprite.size()));
        }
        return size;
    }
    static noop() { }
    // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
    static offset8Directions() {
        return [
            v_(-1, -1),
            v_(0, -1),
            v_(1, -1),
            v_(1, 0),
            v_(1, 1),
            v_(0, 1),
            v_(-1, 1),
            v_(-1, 0),
        ];
    }
    // TODO: consider moving this to either DrawApi or the game itself
    static printWithOutline(text, canvasXy1, textColor, outlineColor, centerXy = [false, false]) {
        for (const offset of BpxUtils.offset8Directions()) {
            BeetPx.print(text, canvasXy1.add(offset), outlineColor, centerXy);
        }
        BeetPx.print(text, canvasXy1, textColor, centerXy);
    }
    static randomElementOf(array) {
        if (array.length <= 0)
            return undefined;
        return array[Math.floor(Math.random() * array.length)];
    }
    static range(n) {
        return Array.from({ length: n }, (_element, index) => index);
    }
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     */
    static throwError(message) {
        throw Error(message);
    }
    /**
     * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigAtan2(x, y) {
        return Math.atan2(y, x) / Math.PI / 2;
    }
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigCos(turnAngle) {
        return Math.cos(turnAngle * Math.PI * 2);
    }
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigSin(turnAngle) {
        return Math.sin(turnAngle * Math.PI * 2);
    }
    static wait(millis) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), millis);
        });
    }
}
export const u_ = BpxUtils;
