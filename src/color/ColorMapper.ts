import { BpxRgbColor } from "./RgbColor";

export type BpxColorMapper = (
  sourceColor: BpxRgbColor | null,
  x: number,
  y: number,
) => BpxRgbColor | null;
