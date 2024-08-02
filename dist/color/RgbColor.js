/**
 * A representation of a RGB, fully opaque color
 *
 * @category Colors
 */
export class BpxRgbColor {
    /**
     * @example
     * ```ts
     * BpxRgbColor.of(255, 0, 77);
     * ```
     *
     * @group Static factories
     */
    static of(r, g, b) {
        return new BpxRgbColor(r, g, b);
    }
    /**
     * @example
     * ```ts
     * BpxRgbColor.fromCssHex("#FF004D");
     * ```
     *
     * @group Static factories
     */
    static fromCssHex(cssHex) {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
            throw Error("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
        }
        return new BpxRgbColor(parseInt(cssHex.slice(1, 3), 16), parseInt(cssHex.slice(3, 5), 16), parseInt(cssHex.slice(5, 7), 16));
    }
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of colors.
     *
     * @example
     * ```ts
     * const c:
     *   | null
     *   | BpxRgbColor
     *   | BpxPatternColors
     *   | BpxSpriteColorMapping
     *   | BpxCanvasSnapshotColorMapping
     *   = getColor();
     * if (c == null) {
     *   
     * } else if (c.type === "rgb") {
     *   
     * } else if (c.type === "pattern") {
     *   
     * } else if (c.type === "sprite_mapping") {
     *   
     * } else if (c.type === "canvas_snapshot_mapping") {
     *   
     * } else {
     *   $u.assertUnreachable(c);
     * }
     * ```
     */
    type = "rgb";
    /**
     * A red component, an integer between 0 and 255.
     */
    r;
    /**
     A green component, an integer between 0 and 255.
     */
    g;
    /**
     A blue component, an integer between 0 and 255.
     */
    b;
    /**
     * A hex representation of this color. Can be used e.g. for CSS.
     * Or just for simple way to store a color as a single value.
     */
    cssHex;
    constructor(r, g, b) {
        this.r = Math.min(Math.max(0x00, Math.round(r)), 0xff);
        this.g = Math.min(Math.max(0x00, Math.round(g)), 0xff);
        this.b = Math.min(Math.max(0x00, Math.round(b)), 0xff);
        this.cssHex =
            "#" +
                r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");
    }
    /**
     * Checks if this color has same red, green, and blue components as the other one.
     */
    isSameAs(another) {
        return another.r === this.r && another.g === this.g && another.b === this.b;
    }
    /**
     * Returns an array containing red, green, and blue components of this color.
     */
    asArray() {
        return [this.r, this.g, this.b];
    }
}
