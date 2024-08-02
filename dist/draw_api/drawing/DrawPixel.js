export class DrawPixel {
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
    }
    draw(xy, color, pattern) {
        xy = xy.round();
        if (!this.#canvas.canSetAt(xy.x, xy.y)) {
            return;
        }
        if (pattern.hasPrimaryColorAt(xy.x, xy.y)) {
            this.#canvas.set(color, xy.x, xy.y);
        }
    }
}
//# sourceMappingURL=DrawPixel.js.map