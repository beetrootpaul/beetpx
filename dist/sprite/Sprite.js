import { BpxVector2d } from "../misc/Vector2d";
/**
 * A definition of a sprite,
 * which can later be used for drawing by {@link BeetPxDraw.sprite}.
 *
 * @see {@link $spr}
 *
 * @category Drawing
 */
export class BpxSprite {
    /**
     * @see {@link $spr}
     *
     * @group Static factories
     */
    static from(imageUrl, w, h, x, y) {
        return new BpxSprite(imageUrl, w, h, x, y);
    }
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of sprites.
     *
     * @example
     * ```ts
     * const s: BpxSprite | BpxAnimatedSprite = getSprite();
     * if (s.type === "static") {
     *   
     * } else if (s.type === "animated") {
     *   
     * } else {
     *   $u.assertUnreachable(s);
     * }
     * ```
     */
    type = "static";
    imageUrl;
    size;
    xy;
    constructor(imageUrl, w, h, x, y) {
        if (w < 0) {
            w = -w;
            x -= w;
        }
        if (h < 0) {
            h = -h;
            y -= h;
        }
        this.imageUrl = imageUrl;
        this.xy = BpxVector2d.of(x, y).round();
        this.size = BpxVector2d.of(x + w, y + h)
            .round()
            .sub(this.xy);
    }
    /**
     * Creates a new sprite definition, clipped by given sprite coordinates.
     */
    clipBy(xy1, xy2) {
        const xy = this.xy.clamp(xy1, xy2);
        const wh = this.xy.add(this.size).clamp(xy1, xy2).sub(xy);
        return new BpxSprite(this.imageUrl, wh.x, wh.y, xy.x, xy.y);
    }
}
