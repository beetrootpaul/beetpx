import { BpxRgbColor } from "./RgbColor";

/**
 * TODO: docs
 */
export type BpxColorMapper = (
  sourceColor: BpxRgbColor | null,
  x: number,
  y: number,
) => BpxRgbColor | null;
