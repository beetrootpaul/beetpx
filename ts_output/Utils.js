"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const BeetPx_1 = require("./BeetPx");
const Xy_1 = require("./Xy");
class Utils {
    // Returns the middle number. Example usage: `clamp(min, value, max)`
    //   in order to find a value which is:
    //   - `value` if it is `>= min` and `<= max`
    //   - `min` if `value` is `< min`
    //   - `max` if `value` is `> max`
    static clamp(a, b, c) {
        return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
    }
    // TODO: tests for edge cases
    static booleanChangingEveryNthFrame(n) {
        return BeetPx_1.BeetPx.frameNumber % (n * 2) < n;
    }
    // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
    static get offset8Directions() {
        return [
            (0, Xy_1.xy_)(-1, -1),
            (0, Xy_1.xy_)(0, -1),
            (0, Xy_1.xy_)(1, -1),
            (0, Xy_1.xy_)(1, 0),
            (0, Xy_1.xy_)(1, 1),
            (0, Xy_1.xy_)(0, 1),
            (0, Xy_1.xy_)(-1, 1),
            (0, Xy_1.xy_)(-1, 0),
        ];
    }
    // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
    static measureTextSize(text) {
        const charSprites = BeetPx_1.BeetPx.drawApi.getFont()?.spritesFor(text) ?? [];
        return charSprites.reduce((sizeSoFar, nextSprite) => Xy_1.Xy.max(sizeSoFar, nextSprite.positionInText.add(nextSprite.sprite.size())), Xy_1.Xy.zero);
    }
    static printWithOutline(text, canvasXy1, textColor, outlineColor) {
        Utils.offset8Directions.forEach((offset) => {
            BeetPx_1.BeetPx.drawApi.print(text, canvasXy1.add(offset), outlineColor);
        });
        BeetPx_1.BeetPx.drawApi.print(text, canvasXy1, textColor);
    }
    // to be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`
    static throwError(message) {
        throw Error(message);
    }
}
exports.Utils = Utils;
