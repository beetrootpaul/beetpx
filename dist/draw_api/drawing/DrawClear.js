export class DrawClear {
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
    }
    draw(color) {
        for (let x = 0; x < this.#canvas.canvasSize.x; ++x) {
            for (let y = 0; y < this.#canvas.canvasSize.y; ++y) {
                this.#canvas.set(color, x, y);
            }
        }
    }
}
//# sourceMappingURL=DrawClear.js.map