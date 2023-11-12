import { BpxSolidColor } from "./SolidColor";

export type BpxColorMapper = (
  sourceColor: BpxSolidColor | null,
) => BpxSolidColor | null;
