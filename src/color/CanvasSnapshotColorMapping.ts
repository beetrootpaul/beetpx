import { CanvasSnapshot } from "../canvas_pixels/CanvasSnapshot";
import { BpxColor, BpxColorId } from "./Color";
import { BpxColorMapper } from "./ColorMapper";
import { BpxSolidColor } from "./SolidColor";

export class BpxCanvasSnapshotColorMapping implements BpxColor {
  static #nextId = 1;

  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__canvasSnapshotMapping = true;

  readonly id: BpxColorId = `canvas-snapshot-mapping:${BpxCanvasSnapshotColorMapping
    .#nextId++}`;

  readonly #mapping: BpxColorMapper;

  constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  getMappedColor(
    snapshot: CanvasSnapshot | null,
    index: number,
  ): BpxSolidColor | null {
    return snapshot ? this.#mapping(snapshot.getColorAtIndex(index)) : null;
  }
}
