var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontPico8_instances, _a, _BpxFontPico8_spriteGlyph;
import { rgb_p8_ } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";
import { BpxFont } from "./Font";


export class BpxFontPico8 extends BpxFont {
    constructor() {
        super(...arguments);
        _BpxFontPico8_instances.add(this);
        this.ascent = 5;
        this.descent = 0;
        this.lineGap = 1;
        this.spriteSheetUrls = [_a.spriteSheetUrl];
        this.glyphs = new Map([
            [" ", { type: "whitespace", advance: 4 }],
            
            ["0", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 0, 3)],
            ["1", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 1, 3)],
            ["2", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 2, 3)],
            ["3", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 3, 3)],
            ["4", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 4, 3)],
            ["5", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 5, 3)],
            ["6", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 6, 3)],
            ["7", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 7, 3)],
            ["8", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 8, 3)],
            
            ["-", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 13, 2)],
            ["+", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 11, 2)],
            ["=", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 13, 3)],
            
            ["(", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 8, 2)],
            [")", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 9, 2)],
            ["[", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 11, 5)],
            ["]", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 13, 5)],
            ["{", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 11, 7)],
            ["}", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 13, 7)],
            ["<", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 12, 3)],
            [">", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 14, 3)],
            
            ["~", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 14, 7)],
            ["!", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 1, 2)],
            ["?", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 15, 3)],
            ["@", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 0, 4)],
            ["#", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 3, 2)],
            ["$", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 4, 2)],
            ["%", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 5, 2)],
            ["^", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 14, 5)],
            ["&", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 6, 2)],
            ["*", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 10, 2)],
            ["_", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 15, 5)],
            
            [".", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 14, 2)],
            [",", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 12, 2)],
            [":", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 10, 3)],
            [";", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 11, 3)],
            
            ["`", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 0, 6)],
            ["'", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 7, 2)],
            ['"', __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 2, 2)],
            
            ["/", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 15, 2)],
            ["|", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 12, 7)],
            ["\\", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 12, 5)],
            
            ["a", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 1, 6)],
            ["b", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 2, 6)],
            ["c", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 3, 6)],
            ["d", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 4, 6)],
            ["e", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 5, 6)],
            ["f", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 6, 6)],
            ["g", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 7, 6)],
            ["h", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 8, 6)],
            ["i", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 9, 6)],
            ["j", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 10, 6)],
            ["k", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 11, 6)],
            ["l", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 12, 6)],
            ["m", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 13, 6)],
            ["n", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 14, 6)],
            ["o", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 15, 6)],
            ["p", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 0, 7)],
            ["q", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 1, 7)],
            ["r", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 2, 7)],
            ["s", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 3, 7)],
            ["t", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 4, 7)],
            ["u", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 5, 7)],
            ["v", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 6, 7)],
            ["w", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 7, 7)],
            ["x", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 8, 7)],
            ["y", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 9, 7)],
            ["z", __classPrivateFieldGet(this, _BpxFontPico8_instances, "m", _BpxFontPico8_spriteGlyph).call(this, 10, 7)],
        ]);
    }
    isSpriteSheetTextColor(color) {
        return color?.cssHex === rgb_p8_.white.cssHex;
    }
    mapChar(char) {
        return char.toLowerCase();
    }
}
_a = BpxFontPico8, _BpxFontPico8_instances = new WeakSet(), _BpxFontPico8_spriteGlyph = function _BpxFontPico8_spriteGlyph(tileX, tileY) {
    const sprite = BpxSprite.from(_a.spriteSheetUrl, 3, 5, tileX * 8, tileY * 8);
    return {
        type: "sprite",
        sprite: sprite,
        advance: sprite.size.x + 1,
    };
};
BpxFontPico8.spriteSheetUrl = ".beetpx/pico-8-font.png";
