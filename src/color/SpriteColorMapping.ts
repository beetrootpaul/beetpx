import { BpxColor, BpxColorId } from "./Color";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

export class BpxSpriteColorMapping implements BpxColor {
  static noMapping: BpxSpriteColorMapping = new BpxSpriteColorMapping((c) => c);

  static fromMapEntries(
    mapEntries: Array<[BpxColorId, BpxRgbColor | null]>,
  ): BpxSpriteColorMapping {
    const map = new Map<BpxColorId, BpxRgbColor | null>(mapEntries);
    return new BpxSpriteColorMapping((spriteColor) => {
      if (!spriteColor) return spriteColor;
      const mapped = map.get(spriteColor.id);
      return typeof mapped === "undefined" ? spriteColor : mapped;
    });
  }

  // TODO: REMOVE
  static nextId = 1;

  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__spriteMapping = true;

  readonly id: BpxColorId = `sprite-mapping:${BpxSpriteColorMapping.nextId++}`;

  readonly #mapping: BpxColorMapper;

  constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  getMappedColor(spriteColor: BpxRgbColor | null): BpxRgbColor | null {
    return this.#mapping(spriteColor);
  }
}
