import { BeetPxDraw } from "../";
import { adjacent8 } from "./adjacent8";
export function drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts) {
    for (const offset of adjacent8()) {
        BeetPxDraw.text(text, canvasXy1.add(offset), outlineColor, {
            centerXy: opts?.centerXy,
            scaleXy: opts?.scaleXy,
        });
    }
    BeetPxDraw.text(text, canvasXy1, textColor, {
        centerXy: opts?.centerXy,
        scaleXy: opts?.scaleXy,
    });
}
//# sourceMappingURL=drawTextWithOutline.js.map