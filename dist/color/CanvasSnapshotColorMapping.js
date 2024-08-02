/**
 * @see {@link BeetPxDraw.takeCanvasSnapshot}
 *
 * @see https:
 *
 * @category Drawing
 */
export class BpxCanvasSnapshotColorMapping {
    /**
     * @group Static factories
     */
    static of(mapping) {
        return new BpxCanvasSnapshotColorMapping(mapping);
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
    type = "canvas_snapshot_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    /**
     * The main method of this class, used to get a mapped color for a given color on the canvas snapshot.
     */
    getMappedColor(snapshot, canvasX, canvasY) {
        return snapshot ?
            this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
            : null;
    }
}
