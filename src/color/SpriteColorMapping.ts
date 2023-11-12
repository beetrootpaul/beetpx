import { BpxColor, BpxColorId } from "./Color";
import { BpxColorMapper } from "./ColorMapper";
import { BpxSolidColor } from "./SolidColor";

export class BpxSpriteColorMapping implements BpxColor {
  static noMapping: BpxSpriteColorMapping = new BpxSpriteColorMapping((c) => c);

  static fromMapEntries(
    mapEntries: Array<[BpxColorId, BpxSolidColor | null]>,
  ): BpxSpriteColorMapping {
    const map = new Map<BpxColorId, BpxSolidColor | null>(mapEntries);
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

  getMappedColor(spriteColor: BpxSolidColor | null): BpxSolidColor | null {
    return this.#mapping(spriteColor);
  }
}
