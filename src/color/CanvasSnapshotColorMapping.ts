import { CanvasSnapshot } from "../canvas_pixels/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

export class BpxCanvasSnapshotColorMapping {
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__canvasSnapshotMapping = true;

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
