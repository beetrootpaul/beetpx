import { BeetPxDraw } from "../";
import type { BpxRgbColor } from "../color/RgbColor";
import type { BpxVector2d } from "../misc/Vector2d";
import { offset8Directions } from "./offset8Directions";

export function drawTextWithOutline(
  text: string,
  canvasXy1: BpxVector2d,
  textColor: BpxRgbColor,
  outlineColor: BpxRgbColor,
  opts?: {
    centerXy?: [boolean, boolean];
    scaleXy?: BpxVector2d;
  },
): void {
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
