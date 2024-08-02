import { BeetPxDraw } from "../";
import { offset8Directions } from "./offset8Directions";
export function drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts) {
    for (const offset of offset8Directions()) {
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