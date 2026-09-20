import { BpxVector2d } from "../misc/Vector2d";
export class Canvas {
    canvasSize;
    #minX;
    #minY;
    #maxX;
    #maxY;
    #snapshot = null;
    constructor(canvasSize) {
        this.canvasSize = canvasSize.round();
        this.#minX = 0;
        this.#minY = 0;
        this.#maxX = this.canvasSize.x - 1;
        this.#maxY = this.canvasSize.y - 1;
    }
    setClippingRegion(xy, wh) {
        const prev = [
            BpxVector2d.of(this.#minX, this.#minY),
            BpxVector2d.of(this.#maxX - this.#minX + 1, this.#maxY - this.#minY + 1),
        ];
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMaxOf(xy.round(), xy.add(wh).round());
        this.#minX = xyMinInclusive.x;
        this.#minY = xyMinInclusive.y;
        this.#maxX = xyMaxExclusive.x - 1;
        this.#maxY = xyMaxExclusive.y - 1;
        return prev;
    }
    removeClippingRegion() {
        return this.setClippingRegion(BpxVector2d.of(0, 0), this.canvasSize);
    }
    canSetAny(xMin, yMin, xMax, yMax) {
        return (xMax >= this.#minX &&
            yMax >= this.#minY &&
            xMin <= this.#maxX &&
            yMin <= this.#maxY);
    }
    canSetAt(x, y) {
        return (x >= this.#minX && y >= this.#minY && x <= this.#maxX && y <= this.#maxY);
    }
    takeSnapshot() {
        this.#snapshot = this.newSnapshot();
    }
    getMostRecentSnapshot() {
        return this.#snapshot;
    }
    render() {
        this.#snapshot = null;
        this.doRender();
    }
}
//# sourceMappingURL=Canvas.js.map