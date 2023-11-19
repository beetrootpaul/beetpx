import { BpxRgbColor } from "./RgbColor";

export type BpxColorMapper = (
  sourceColor: BpxRgbColor | null,
) => BpxRgbColor | null;
