import { BpxVector2d } from "../misc/Vector2d";
import { BpxRgbColor } from "./RgbColor";

export type BpxColorMapper = (
  sourceColor: BpxRgbColor | null,
  xy: BpxVector2d,
) => BpxRgbColor | null;
