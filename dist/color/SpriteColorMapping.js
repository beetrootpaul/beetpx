/**
 * @see {@link BeetPxDraw.setSpriteColorMapping}
 *
 * @category Drawing
 */
export class BpxSpriteColorMapping {
    /**
     * A mapping used by default, which takes sprite colors as they are,
     * without any changes. An equivalent of `BpxSpriteColorMapping.of((c, _x, _y) => c)`.
     *
     * @group Static values
     */
    static noMapping = BpxSpriteColorMapping.of((c, _x, _y) => c);
    /**
     * Creates a simplified color mapping, based on a map of sprite colors to the new ones.
     *
     * `null` can be used to map a given sprite color into a transparency. It is useful e.g. when
     * we have a sprite with a black used as a background, so we can treat all black pixels as
     * transparent when drawing.
     *
     * @example
     * ```ts
     * BpxSpriteColorMapping.from([
     *   [$rgb_red, $rgb_green],
     *   [$rgb_blue, $rgb_green],
     *   [$rgb_yellow, null],
     * ]);
     * ```
     *
     * @group Static factories
     */
    static from(colorMappingEntries) {
        const map = new Map(colorMappingEntries.map(([from, to]) => [from.cssHex, to]));
        return new BpxSpriteColorMapping((spriteColor, _x, _y) => {
            if (!spriteColor)
                return spriteColor;
            const mapped = map.get(spriteColor.cssHex);
            return typeof mapped === "undefined" ? spriteColor : mapped;
        });
    }
    /**
     * Creates a color mapping which uses a function to map a sprite color
     * into a new one.
     *
     * @example
     * ```ts
     * BpxSpriteColorMapping.of((color: BpxRgbColor | null, spriteX: number, spriteY: number) =>
     *   color
     *     ? $rgb(255 - color.r, 255 - color.g, 255 - color.b)
     *     : null
     * );
     * ```
     *
     * @group Static factories
     */
    static of(mapping) {
        return new BpxSpriteColorMapping(mapping);
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
    type = "sprite_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    /**
     * The main method of this class, used to get a mapped color for a given color on the sprite.
     */
    getMappedColor(spriteColor, spriteX, spriteY) {
        return this.#mapping(spriteColor, spriteX, spriteY);
    }
}
