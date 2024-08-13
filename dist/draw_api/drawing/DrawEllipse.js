import { BpxVector2d } from "../../misc/Vector2d";
export class DrawEllipse {
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
    }
    draw(xy, wh, color, fill, pattern) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMaxOf(xy.round(), xy.add(wh).round());
        if (xyMaxExclusive.x - xyMinInclusive.x <= 0 ||
            xyMaxExclusive.y - xyMinInclusive.y <= 0) {
            return;
        }
        if (!this.#canvas.canSetAny(xyMinInclusive.x, xyMinInclusive.y, xyMaxExclusive.x - 1, xyMaxExclusive.y - 1)) {
            return;
        }
        const c1 = color.type === "pattern" ? color.primary : color;
        const c2 = color.type === "pattern" ? color.secondary : null;
        const sn = c1?.type === "canvas_snapshot_mapping"
            ? this.#canvas.getMostRecentSnapshot()
            : null;
        const p = pattern;
        let a = xyMaxExclusive.x - xyMinInclusive.x - 1;
        let b = xyMaxExclusive.y - xyMinInclusive.y - 1;
        let b1 = b & 1;
        let left = xyMinInclusive.x;
        let right = xyMaxExclusive.x - 1;
        let bottom = xyMinInclusive.y + Math.floor((b + 1) / 2);
        let top = bottom - b1;
        let errIncrementX = 4 * (1 - a) * b * b;
        let errIncrementY = 4 * (b1 + 1) * a * a;
        let currentErr = errIncrementX + errIncrementY + b1 * a * a;
        a = 8 * a * a;
        b1 = 8 * b * b;
        do {
            this.#drawPixel(left, top, c1, c2, p, sn);
            this.#drawPixel(right, top, c1, c2, p, sn);
            this.#drawPixel(right, bottom, c1, c2, p, sn);
            this.#drawPixel(left, bottom, c1, c2, p, sn);
            if (fill === "inside") {
                for (let x = left + 1; x < right; ++x) {
                    this.#drawPixel(x, top, c1, c2, p, sn);
                    this.#drawPixel(x, bottom, c1, c2, p, sn);
                }
            }
            else if (fill === "outside") {
                for (let x = 0; x < left; ++x) {
                    this.#drawPixel(x, top, c1, c2, p, sn);
                    this.#drawPixel(x, bottom, c1, c2, p, sn);
                }
                for (let x = right + 1; x < this.#canvas.canvasSize.x; ++x) {
                    this.#drawPixel(x, top, c1, c2, p, sn);
                    this.#drawPixel(x, bottom, c1, c2, p, sn);
                }
            }
            const currentErrBeforeStep = currentErr;
            if (2 * currentErrBeforeStep <= errIncrementY) {
                bottom += 1;
                top -= 1;
                errIncrementY += a;
                currentErr += errIncrementY;
            }
            if (2 * currentErrBeforeStep >= errIncrementX ||
                2 * currentErr > errIncrementY) {
                left += 1;
                right -= 1;
                errIncrementX += b1;
                currentErr += errIncrementX;
            }
        } while (left <= right);
        while (bottom - top <= b) {
            this.#drawPixel(left - 1, bottom, c1, c2, p, sn);
            this.#drawPixel(right + 1, bottom, c1, c2, p, sn);
            if (fill === "outside") {
                for (let x = 0; x < left - 1; ++x) {
                    this.#drawPixel(x, bottom, c1, c2, p, sn);
                }
                for (let x = right + 2; x < this.#canvas.canvasSize.x; ++x) {
                    this.#drawPixel(x, bottom, c1, c2, p, sn);
                }
            }
            bottom += 1;
            this.#drawPixel(left - 1, top, c1, c2, p, sn);
            this.#drawPixel(right + 1, top, c1, c2, p, sn);
            if (fill === "outside") {
                for (let x = 0; x < left - 1; ++x) {
                    this.#drawPixel(x, top, c1, c2, p, sn);
                }
                for (let x = right + 2; x < this.#canvas.canvasSize.x; ++x) {
                    this.#drawPixel(x, top, c1, c2, p, sn);
                }
            }
            top -= 1;
        }
        if (fill === "outside") {
            for (let x = 0; x < this.#canvas.canvasSize.x; ++x) {
                for (let y = 0; y < top + 1; ++y) {
                    this.#drawPixel(x, y, c1, c2, p, sn);
                }
                for (let y = bottom; y < this.#canvas.canvasSize.y; ++y) {
                    this.#drawPixel(x, y, c1, c2, p, sn);
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
//# sourceMappingURL=DrawEllipse.js.map