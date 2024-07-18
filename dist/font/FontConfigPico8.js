var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontConfigPico8_instances, _BpxFontConfigPico8_spriteGlyph;
import { BpxPalettePico8 } from "../color/PalettePico8";
import { BpxSprite } from "../sprite/Sprite";
/**
 * A free to use (CC-0) font created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https:
 */
export class BpxFontConfigPico8 {
    constructor() {
        _BpxFontConfigPico8_instances.add(this);
        this.ascent = 5;
        this.descent = 0;
        this.lineGap = 1;
        this.glyphs = new Map([
            [" ", { type: "whitespace", advance: 4 }],
            
            ["0", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 0, 3)],
            ["1", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 1, 3)],
            ["2", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 2, 3)],
            ["3", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 3, 3)],
            ["4", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 4, 3)],
            ["5", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 5, 3)],
            ["6", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 6, 3)],
            ["7", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 7, 3)],
            ["8", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 8, 3)],
            ["9", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 9, 3)],
            
            ["-", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 13, 2)],
            ["+", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 11, 2)],
            ["=", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 13, 3)],
            
            ["(", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 8, 2)],
            [")", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 9, 2)],
            ["[", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 11, 5)],
            ["]", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 13, 5)],
            ["{", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 11, 7)],
            ["}", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 13, 7)],
            ["<", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 12, 3)],
            [">", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 14, 3)],
            
            ["~", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 14, 7)],
            ["!", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 1, 2)],
            ["?", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 15, 3)],
            ["@", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 0, 4)],
            ["#", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 3, 2)],
            ["$", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 4, 2)],
            ["%", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 5, 2)],
            ["^", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 14, 5)],
            ["&", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 6, 2)],
            ["*", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 10, 2)],
            ["_", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 15, 5)],
            
            [".", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 14, 2)],
            [",", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 12, 2)],
            [":", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 10, 3)],
            [";", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 11, 3)],
            
            ["`", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 0, 6)],
            ["'", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 7, 2)],
            ['"', __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 2, 2)],
            
            ["/", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 15, 2)],
            ["|", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 12, 7)],
            ["\\", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 12, 5)],
            
            ["a", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 1, 6)],
            ["b", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 2, 6)],
            ["c", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 3, 6)],
            ["d", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 4, 6)],
            ["e", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 5, 6)],
            ["f", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 6, 6)],
            ["g", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 7, 6)],
            ["h", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 8, 6)],
            ["i", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 9, 6)],
            ["j", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 10, 6)],
            ["k", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 11, 6)],
            ["l", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 12, 6)],
            ["m", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 13, 6)],
            ["n", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 14, 6)],
            ["o", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 15, 6)],
            ["p", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 0, 7)],
            ["q", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 1, 7)],
            ["r", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 2, 7)],
            ["s", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 3, 7)],
            ["t", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 4, 7)],
            ["u", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 5, 7)],
            ["v", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 6, 7)],
            ["w", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 7, 7)],
            ["x", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 8, 7)],
            ["y", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 9, 7)],
            ["z", __classPrivateFieldGet(this, _BpxFontConfigPico8_instances, "m", _BpxFontConfigPico8_spriteGlyph).call(this, 10, 7)],
        ]);
    }
    mapChar(char) {
        return char.toLowerCase();
    }
}
_BpxFontConfigPico8_instances = new WeakSet(), _BpxFontConfigPico8_spriteGlyph = function _BpxFontConfigPico8_spriteGlyph(tileX, tileY) {
    const sprite = BpxSprite.from(".beetpx/pico-8-font.png", 3, 5, tileX * 8, tileY * 8);
    return {
        type: "sprite",
        sprite: sprite,
        isTextColor: colorFromSpriteSheet => colorFromSpriteSheet?.cssHex === BpxPalettePico8.white.cssHex,
        advance: sprite.size.x + 1,
    };
};
