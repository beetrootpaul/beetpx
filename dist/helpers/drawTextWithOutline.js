import { BeetPx } from "../BeetPx";
import { offset8Directions } from "./offset8Directions";
export function drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts) {
    for (const offset of offset8Directions()) {
        BeetPx.draw.text(text, canvasXy1.add(offset), outlineColor, {
            centerXy: opts?.centerXy,
            scaleXy: opts?.scaleXy,
            colorMarkers: opts?.outlineColorMarkers,
        });
    }
    BeetPx.draw.text(text, canvasXy1, textColor, {
        centerXy: opts?.centerXy,
        scaleXy: opts?.scaleXy,
        colorMarkers: opts?.textColorMarkers,
    });
}
