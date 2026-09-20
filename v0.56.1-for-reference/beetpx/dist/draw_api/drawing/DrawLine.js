import { $v } from "../../shorthands";
export class DrawLine {
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
    }
    draw(xy, wh, color, pattern) {
        const xyStart = xy.round();
        const xyEnd = xy.add(wh).round();
        if (xyEnd.x - xyStart.x === 0 || xyEnd.y - xyStart.y === 0) {
            return;
        }
        wh = xyEnd.sub(xyStart);
        const whSub1 = wh.sub(wh.sign());
        const c1 = color.type === "pattern" ? color.primary : color;
        const c2 = color.type === "pattern" ? color.secondary : null;
        const sn = c1?.type === "canvas_snapshot_mapping"
            ? this.#canvas.getMostRecentSnapshot()
            : null;
        const fp = pattern;
        let dXy = whSub1.abs().mul($v(1, -1));
        let currentXy = xyStart;
        const targetXy = xyStart.add(whSub1);
        const step = whSub1.sign();
        let err = dXy.x + dXy.y;
        while (true) {
            this.#drawPixel(currentXy.x, currentXy.y, c1, c2, fp, sn);
            if (currentXy.eq(targetXy))
                break;
            const errBeforeStep = err;
            if (2 * errBeforeStep >= dXy.y) {
                currentXy = currentXy.add($v(step.x, 0));
                err += dXy.y;
            }
            if (2 * errBeforeStep <= dXy.x) {
                currentXy = currentXy.add($v(0, step.y));
                err += dXy.x;
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
//# sourceMappingURL=DrawLine.js.map