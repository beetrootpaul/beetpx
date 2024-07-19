var _a;
import { BpxPalettePico8 } from "../color/PalettePico8";
import { BpxSprite } from "../sprite/Sprite";
/**
 * A free to use (CC-0) font created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https:
 */
export class BpxFontConfigPico8 {
    static spriteSheetUrl = ".beetpx/pico-8-font.png";
    ascent = 5;
    descent = 0;
    lineGap = 1;
    mapChar(char) {
        return char.toLowerCase();
    }
    glyphs = new Map([
        [" ", { type: "whitespace", advance: 4 }],
        
        ["0", this.#spriteGlyph(0, 3)],
        ["1", this.#spriteGlyph(1, 3)],
        ["2", this.#spriteGlyph(2, 3)],
        ["3", this.#spriteGlyph(3, 3)],
        ["4", this.#spriteGlyph(4, 3)],
        ["5", this.#spriteGlyph(5, 3)],
        ["6", this.#spriteGlyph(6, 3)],
        ["7", this.#spriteGlyph(7, 3)],
        ["8", this.#spriteGlyph(8, 3)],
        ["9", this.#spriteGlyph(9, 3)],
        
        ["-", this.#spriteGlyph(13, 2)],
        ["+", this.#spriteGlyph(11, 2)],
        ["=", this.#spriteGlyph(13, 3)],
        
        ["(", this.#spriteGlyph(8, 2)],
        [")", this.#spriteGlyph(9, 2)],
        ["[", this.#spriteGlyph(11, 5)],
        ["]", this.#spriteGlyph(13, 5)],
        ["{", this.#spriteGlyph(11, 7)],
        ["}", this.#spriteGlyph(13, 7)],
        ["<", this.#spriteGlyph(12, 3)],
        [">", this.#spriteGlyph(14, 3)],
        
        ["~", this.#spriteGlyph(14, 7)],
        ["!", this.#spriteGlyph(1, 2)],
        ["?", this.#spriteGlyph(15, 3)],
        ["@", this.#spriteGlyph(0, 4)],
        ["#", this.#spriteGlyph(3, 2)],
        ["$", this.#spriteGlyph(4, 2)],
        ["%", this.#spriteGlyph(5, 2)],
        ["^", this.#spriteGlyph(14, 5)],
        ["&", this.#spriteGlyph(6, 2)],
        ["*", this.#spriteGlyph(10, 2)],
        ["_", this.#spriteGlyph(15, 5)],
        
        [".", this.#spriteGlyph(14, 2)],
        [",", this.#spriteGlyph(12, 2)],
        [":", this.#spriteGlyph(10, 3)],
        [";", this.#spriteGlyph(11, 3)],
        
        ["`", this.#spriteGlyph(0, 6)],
        ["'", this.#spriteGlyph(7, 2)],
        ['"', this.#spriteGlyph(2, 2)],
        
        ["/", this.#spriteGlyph(15, 2)],
        ["|", this.#spriteGlyph(12, 7)],
        ["\\", this.#spriteGlyph(12, 5)],
        
        ["a", this.#spriteGlyph(1, 6)],
        ["b", this.#spriteGlyph(2, 6)],
        ["c", this.#spriteGlyph(3, 6)],
        ["d", this.#spriteGlyph(4, 6)],
        ["e", this.#spriteGlyph(5, 6)],
        ["f", this.#spriteGlyph(6, 6)],
        ["g", this.#spriteGlyph(7, 6)],
        ["h", this.#spriteGlyph(8, 6)],
        ["i", this.#spriteGlyph(9, 6)],
        ["j", this.#spriteGlyph(10, 6)],
        ["k", this.#spriteGlyph(11, 6)],
        ["l", this.#spriteGlyph(12, 6)],
        ["m", this.#spriteGlyph(13, 6)],
        ["n", this.#spriteGlyph(14, 6)],
        ["o", this.#spriteGlyph(15, 6)],
        ["p", this.#spriteGlyph(0, 7)],
        ["q", this.#spriteGlyph(1, 7)],
        ["r", this.#spriteGlyph(2, 7)],
        ["s", this.#spriteGlyph(3, 7)],
        ["t", this.#spriteGlyph(4, 7)],
        ["u", this.#spriteGlyph(5, 7)],
        ["v", this.#spriteGlyph(6, 7)],
        ["w", this.#spriteGlyph(7, 7)],
        ["x", this.#spriteGlyph(8, 7)],
        ["y", this.#spriteGlyph(9, 7)],
        ["z", this.#spriteGlyph(10, 7)],
        
        ["⬅", this.#spriteGlyph(11, 8, 7)],
        ["➡", this.#spriteGlyph(1, 9, 7)],
        ["⬆", this.#spriteGlyph(4, 9, 7)],
        ["⬇", this.#spriteGlyph(3, 8, 7)],
        ["⭐", this.#spriteGlyph(2, 9, 7)],
        ["❤️", this.#spriteGlyph(7, 8, 7)],
        ["❎", this.#spriteGlyph(7, 9, 7)],
        ["⭕", this.#spriteGlyph(14, 8, 7)],
        ["♪", this.#spriteGlyph(13, 8, 7)],
    ]);
    #spriteGlyph(tileX, tileY, w = 3) {
        const sprite = BpxSprite.from(_a.spriteSheetUrl, w, 5, tileX * 8, tileY * 8);
        return {
            type: "sprite",
            sprite: sprite,
            isTextColor: color => color?.cssHex === BpxPalettePico8.white.cssHex,
            advance: sprite.size.x + 1,
        };
    }
}
_a = BpxFontConfigPico8;
