/**
 * A set of two colors, used in combination with {@link BpxDrawingPattern},
 * where given pixels are colored with either the `primary` or the `secondary`.
 *
 * @category Colors
 */
export class BpxPatternColors {
    primary;
    secondary;
    /**
     * @example
     * ```ts
     * BpxPatternColors.of($rgb_red, $rgb_blue);
     * ```
     *
     * @group Static factories
     */
    static of(primary, secondary) {
        return new BpxPatternColors(primary, secondary);
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
    type = "pattern";
    constructor(
    /**
     * The primary color or a transparency (denoted by `null`).
     */
    primary, 
    /**
     * The secondary color or a transparency (denoted by `null`).
     */
    secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }
}
