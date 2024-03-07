import type { BpxRgbColor } from "../color/RgbColor";
import type { BpxVector2d } from "../misc/Vector2d";
import { offset8Directions } from "./offset8Directions";

// TODO: bring it back
export function drawTextWithOutline(
  text: string,
  canvasXy1: BpxVector2d,
  textColor: BpxRgbColor,
  outlineColor: BpxRgbColor,
  opts: {
    centerXy?: [boolean, boolean];
    scaleXy?: BpxVector2d;
  } = {},
): void {
  for (const offset of offset8Directions()) {
    // BeetPx.drawText(text, canvasXy1.add(offset), outlineColor, opts);
  }
  // BeetPx.drawText(text, canvasXy1, textColor, opts);
}
