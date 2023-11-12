import { BpxSolidColor } from "./SolidColor";
import { BpxTransparentColor } from "./TransparentColor";

export type BpxColorMapper = (
  sourceColor: BpxSolidColor | BpxTransparentColor,
) => BpxSolidColor | BpxTransparentColor;
