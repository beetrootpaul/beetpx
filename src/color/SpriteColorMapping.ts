import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor, BpxRgbCssHex } from "./RgbColor";

/**
 * TODO: docs
 */
export class BpxSpriteColorMapping {
  /**
   * TODO: docs
   */
  static noMapping: BpxSpriteColorMapping = new BpxSpriteColorMapping(
    (c, _x, _y) => c,
  );

  /**
   * TODO: docs
   */
  static from(
    colorMappingEntries: Array<[BpxRgbColor, BpxRgbColor | null]>,
  ): BpxSpriteColorMapping {
    const map = new Map<BpxRgbCssHex, BpxRgbColor | null>(
      colorMappingEntries.map(([from, to]) => [from.cssHex, to]),
    );
    return new BpxSpriteColorMapping((spriteColor, _x, _y) => {
      if (!spriteColor) return spriteColor;
      const mapped = map.get(spriteColor.cssHex);
      return typeof mapped === "undefined" ? spriteColor : mapped;
    });
  }

  /**
   * TODO: docs
   */
  static of(mapping: BpxColorMapper): BpxSpriteColorMapping {
    return new BpxSpriteColorMapping(mapping);
  }

  /**
   * TODO: docs
   */
  readonly type = "sprite_mapping";

  readonly #mapping: BpxColorMapper;

  private constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  /**
   * TODO: docs
   */
  getMappedColor(
    spriteColor: BpxRgbColor | null,
    spriteX: number,
    spriteY: number,
  ): BpxRgbColor | null {
    return this.#mapping(spriteColor, spriteX, spriteY);
  }
}
