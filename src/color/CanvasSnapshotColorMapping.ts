// TODO: make it a function which allows to implement catch it all color
import { CanvasSnapshot } from "../canvas_pixels/CanvasSnapshot";
import { BpxColor, BpxColorId } from "./Color";
import { BpxSolidColor } from "./SolidColor";
import { BpxTransparentColor, transparent_ } from "./TransparentColor";

export class BpxCanvasSnapshotColorMapping implements BpxColor {
  static #nextId = 1;

  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__mapping = true;

  readonly id: BpxColorId = `mapping:${BpxCanvasSnapshotColorMapping
    .#nextId++}`;

  readonly getMappedColor: (
    snapshot: CanvasSnapshot | null,
    index: number,
  ) => BpxSolidColor | BpxTransparentColor;

  constructor(
    mapping: (
      canvasSnapshotColor: BpxSolidColor,
    ) => BpxSolidColor | BpxTransparentColor,
  ) {
    this.getMappedColor = (snapshot: CanvasSnapshot | null, index: number) =>
      snapshot ? mapping(snapshot.getColorAtIndex(index)) : transparent_;
  }
}
