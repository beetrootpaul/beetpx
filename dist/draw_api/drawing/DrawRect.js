import { BpxVector2d } from "../../misc/Vector2d";
export class DrawRect {
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
    }
    draw(xy, wh, color, fill, pattern) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        if (!this.#canvas.canSetAny(xyMinInclusive.x, xyMinInclusive.y, xyMaxExclusive.x - 1, xyMaxExclusive.y - 1)) {
            return;
        }
        const c1 = color.type === "pattern" ? color.primary : color;
        const c2 = color.type === "pattern" ? color.secondary : null;
        const sn = c1?.type === "canvas_snapshot_mapping" ?
            this.#canvas.getMostRecentSnapshot()
            : null;
        const fp = pattern;
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
            this.#drawPixel(x, xyMinInclusive.y, c1, c2, fp, sn);
            this.#drawPixel(x, xyMaxExclusive.y - 1, c1, c2, fp, sn);
        }
        for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
            this.#drawPixel(xyMinInclusive.x, y, c1, c2, fp, sn);
            this.#drawPixel(xyMaxExclusive.x - 1, y, c1, c2, fp, sn);
        }
        if (fill === "inside") {
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
            }
        }
        else if (fill === "outside") {
            for (let x = 0; x < xyMinInclusive.x; x += 1) {
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
                for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
                for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
            }
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
            }
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
            }
            for (let x = xyMaxExclusive.x; x < this.#canvas.canvasSize.x; x += 1) {
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
                for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
                for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
                    this.#drawPixel(x, y, c1, c2, fp, sn);
                }
            }
        }
    }
    #drawPixel(x, y, c1, c2, pattern, snapshot) {
        if (!this.#canvas.canSetAt(x, y)) {
            return;
        }
        if (pattern.hasPrimaryColorAt(x, y)) {
            if (!c1) {
            }
            else if (c1.type === "rgb") {
                this.#canvas.set(c1, x, y);
            }
            else {
                const mapped = c1.getMappedColor(snapshot, x, y);
                if (mapped) {
                    this.#canvas.set(mapped, x, y);
                }
            }
        }
        else {
            if (c2 != null) {
                this.#canvas.set(c2, x, y);
            }
        }
    }
}
//# sourceMappingURL=DrawRect.js.map