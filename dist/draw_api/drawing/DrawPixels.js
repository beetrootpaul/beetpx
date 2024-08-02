import { BpxVector2d } from "../../misc/Vector2d";
import { $v_0_0 } from "../../shorthands";
export class DrawPixels {
    #canvas;
    #options;
    constructor(canvas, options) {
        options ??= {};
        this.#canvas = canvas;
        this.#options = options;
    }
    draw(pixels, targetXy, color, scaleXy, flipXy, pattern) {
        targetXy = this.#options.disableRounding ? targetXy : targetXy.round();
        scaleXy = BpxVector2d.max(scaleXy.floor(), $v_0_0);
        for (let bitsY = 0; bitsY < pixels.asciiRows.length; bitsY += 1) {
            const yBase = targetXy.y +
                (flipXy[1] ? pixels.size.y - 1 - bitsY : bitsY) * scaleXy.y;
            for (let bitsX = 0; bitsX < pixels.asciiRows[bitsY].length; bitsX += 1) {
                const xBase = targetXy.x +
                    (flipXy[0] ? pixels.size.x - 1 - bitsX : bitsX) * scaleXy.x;
                if (pixels.asciiRows[bitsY][bitsX] !== "#") {
                    continue;
                }
                for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
                    for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
                        const y = yBase + yScaledStep;
                        const x = xBase + xScaledStep;
                        if (pattern.hasPrimaryColorAt(x, y)) {
                            if (this.#canvas.canSetAt(x, y)) {
                                this.#canvas.set(color, x, y);
                            }
                        }
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=DrawPixels.js.map