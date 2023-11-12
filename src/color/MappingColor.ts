// TODO: make it a function which allows to implement catch it all color
import {
  BpxCanvasSnapshotId,
  CanvasSnapshot,
} from "../canvas_pixels/CanvasSnapshot";
import { BpxColor, BpxColorId } from "./Color";
import { BpxSolidColor } from "./SolidColor";
import { BpxTransparentColor } from "./TransparentColor";

export class BpxMappingColor implements BpxColor {
  static #nextId = 1;

  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__mapping = true;

  readonly id: BpxColorId = `mapping:${BpxMappingColor.#nextId++}`;

  readonly snapshotId: BpxCanvasSnapshotId;

  readonly getMappedColorFromCanvasSnapshot: (
    snapshot: CanvasSnapshot,
    index: number,
  ) => BpxSolidColor | BpxTransparentColor;

  constructor(
    snapshotId: BpxCanvasSnapshotId,
    mapping: (
      canvasColor: BpxSolidColor,
    ) => BpxSolidColor | BpxTransparentColor,
  ) {
    this.snapshotId = snapshotId;
    this.getMappedColorFromCanvasSnapshot = (
      snapshot: CanvasSnapshot,
      index: number,
    ) => mapping(snapshot.get(index));
  }
}
