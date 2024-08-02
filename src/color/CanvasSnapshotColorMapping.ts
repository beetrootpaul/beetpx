import { CanvasSnapshot } from "../canvas/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

/**
 * TODO: docs
 */
export class BpxCanvasSnapshotColorMapping {
  /**
   * TODO: docs
   */
  static of(mapping: BpxColorMapper): BpxCanvasSnapshotColorMapping {
    return new BpxCanvasSnapshotColorMapping(mapping);
  }

  /**
   * TODO: docs
   */
  readonly type = "canvas_snapshot_mapping";

  readonly #mapping: BpxColorMapper;

  private constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  /**
   * TODO: docs
   */
  getMappedColor(
    snapshot: CanvasSnapshot | null,
    canvasX: number,
    canvasY: number,
  ): BpxRgbColor | null {
    return snapshot ?
        this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
      : null;
  }
}
