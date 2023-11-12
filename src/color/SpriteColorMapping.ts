import { BpxColor, BpxColorId } from "./Color";
import { BpxColorMapper } from "./ColorMapper";
import { BpxSolidColor } from "./SolidColor";
import { BpxTransparentColor } from "./TransparentColor";

export class BpxSpriteColorMapping implements BpxColor {
  static noMapping: BpxSpriteColorMapping = new BpxSpriteColorMapping((c) => c);

  static fromMapEntries(
    mapEntries: Array<[BpxColorId, BpxSolidColor | BpxTransparentColor]>,
  ): BpxSpriteColorMapping {
    const map = new Map<BpxColorId, BpxSolidColor | BpxTransparentColor>(
      mapEntries,
    );
    return new BpxSpriteColorMapping(
      (spriteColor) => map.get(spriteColor.id) ?? spriteColor,
    );
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

  getMappedColor(
    spriteColor: BpxSolidColor | BpxTransparentColor,
  ): BpxSolidColor | BpxTransparentColor {
    return this.#mapping(spriteColor);
  }
}
