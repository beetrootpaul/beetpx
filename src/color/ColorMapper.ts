import { BpxRgbColor } from "./RgbColor";

/**
 * @see {@link BpxSpriteColorMapping}
 * @see {@link BpxCanvasSnapshotColorMapping}
 *
 * @category Drawing
 */
export type BpxColorMapper = (
  sourceColor: BpxRgbColor | null,
  x: number,
  y: number,
) => BpxRgbColor | null;
