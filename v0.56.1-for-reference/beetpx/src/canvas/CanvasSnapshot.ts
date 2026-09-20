import { BpxRgbColor } from "../color/RgbColor";

/**
 * @see {@link BpxCanvasSnapshotColorMapping.getMappedColor}
 *
 * @category Drawing
 */
export interface BpxCanvasSnapshot {
  getColorAt(x: number, y: number): BpxRgbColor;
}
