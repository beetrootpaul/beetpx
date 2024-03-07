import { BeetPx } from "../BeetPx";
import type { BpxRgbColor } from "../color/RgbColor";
import { BpxTextColorMarkers } from "../font/Font";
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
    textColorMarkers?: BpxTextColorMarkers;
    outlineColorMarkers?: BpxTextColorMarkers;
  },
): void {
  for (const offset of offset8Directions()) {
    BeetPx.drawText(text, canvasXy1.add(offset), outlineColor, {
      centerXy: opts?.centerXy,
      scaleXy: opts?.scaleXy,
      colorMarkers: opts?.outlineColorMarkers,
    });
  }
  BeetPx.drawText(text, canvasXy1, textColor, {
    centerXy: opts?.centerXy,
    scaleXy: opts?.scaleXy,
    colorMarkers: opts?.textColorMarkers,
  });
}
