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
   * A property helpful for TypeScript type inference, when distinguishing from
   * other types of colors.
   *
   * @example
   * ```ts
   * const c:
   *   | null
   *   | BpxRgbColor
   *   | BpxPatternColors
   *   | BpxSpriteColorMapping
   *   | BpxCanvasSnapshotColorMapping
   *   = getColor();
   * if (c == null) {
   *   // c is transparent here
   * } else if (c.type === "rgb") {
   *   // c is BpxRgbColor here
   * } else if (c.type === "pattern") {
   *   // c is BpxPatternColors here
   * } else if (c.type === "sprite_mapping") {
   *   // c is BpxSpriteColorMapping here
   * } else {
   *   // c is BpxCanvasSnapshotColorMapping here
   * }
   * ```
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
