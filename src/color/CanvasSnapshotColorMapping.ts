import { CanvasSnapshot } from "../canvas/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

export class BpxCanvasSnapshotColorMapping {
  static of(mapping: BpxColorMapper): BpxCanvasSnapshotColorMapping {
    return new BpxCanvasSnapshotColorMapping(mapping);
  }

  readonly type = "canvas_snapshot_mapping";

  readonly #mapping: BpxColorMapper;

  constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  getMappedColor(
    snapshot: CanvasSnapshot | null,
    index: number,
  ): BpxRgbColor | null {
    return snapshot ? this.#mapping(snapshot.getColorAtIndex(index)) : null;
  }
}
