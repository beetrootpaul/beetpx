// noinspection JSUnusedGlobalSymbols
import { BeetPx } from "./BeetPx";
import { BpxVector2d, v_ } from "./Vector2d";
// TODO: consider exposing those utils as BeetPx global API methods
export class BpxUtils {
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
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
    static measureText(text) {
        var _a, _b;
        const charSprites = (_b = (_a = BeetPx.getFont()) === null || _a === void 0 ? void 0 : _a.spritesFor(text)) !== null && _b !== void 0 ? _b : [];
        return charSprites.reduce((sizeSoFar, nextSprite) => BpxVector2d.max(sizeSoFar, nextSprite.positionInText.add(nextSprite.sprite.size())), BpxVector2d.zero);
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
    static randomElementOf(array) {
        if (array.length <= 0)
            return undefined;
        return array[Math.floor(Math.random() * array.length)];
    }
    // TODO: consider moving this to either DrawApi or the game itself
    static printWithOutline(text, canvasXy1, textColor, outlineColor, centerXy = [false, false]) {
        BpxUtils.offset8Directions().forEach((offset) => {
            BeetPx.print(text, canvasXy1.add(offset), outlineColor, centerXy);
        });
        BeetPx.print(text, canvasXy1, textColor, centerXy);
    }
    static repeatN(n, callback) {
        Array.from({ length: n }).forEach((_element, i) => {
            callback(i);
        });
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
}
export const u_ = BpxUtils;
