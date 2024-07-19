import { type PngDataArray } from "fast-png";
import { BpxRgbColor } from "../color/RgbColor";
import { range } from "../helpers/range";
import { $rgb } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";

export type PreparedSprite = {
  w: number;
  h: number;
  colors: (BpxRgbColor | null)[][];
  // true  = it was taken from a cache
  // false = miss, had to prepare a sprite
  cacheHit: boolean;
};

export class PreparedSprites {
  readonly #cache: Map<string, PreparedSprite> = new Map();

  prepareOrGetFromCache(
    sprite: BpxSprite,
    imgBytes: PngDataArray,
    imgW: number,
    imgChannels: 3 | 4,
  ): PreparedSprite {
    const key =
      sprite.imageUrl +
      "::" +
      sprite.xy.x.toString() +
      ":" +
      sprite.xy.y.toString() +
      ":" +
      sprite.size.x.toString() +
      ":" +
      sprite.size.y.toString();

    if (this.#cache.has(key)) {
      return this.#cache.get(key)!;
    }

    const w = sprite.size.x;
    const h = sprite.size.y;

    const colors: (BpxRgbColor | null)[][] = range(w).map(() =>
      range(h).map(() => null),
    );

    for (let spriteY = 0; spriteY < h; ++spriteY) {
      const imgY = sprite.xy.y + spriteY;
      for (let spriteX = 0; spriteX < w; ++spriteX) {
        const imgX = sprite.xy.x + spriteX;

        const imgIndex = (imgY * imgW + imgX) * imgChannels;

        colors[spriteX]![spriteY] =
          imgChannels === 3 ?
            $rgb(
              imgBytes[imgIndex]!,
              imgBytes[imgIndex + 1]!,
              imgBytes[imgIndex + 2]!,
            )
          : imgBytes[imgIndex + 3]! >= 0xff / 2 ?
            $rgb(
              imgBytes[imgIndex]!,
              imgBytes[imgIndex + 1]!,
              imgBytes[imgIndex + 2]!,
            )
          : null;
      }
    }

    const preparedSprite: PreparedSprite = {
      w: sprite.size.x,
      h: sprite.size.y,
      colors: colors,
      cacheHit: true,
    };
    this.#cache.set(key, preparedSprite);

    return { ...preparedSprite, cacheHit: false };
  }
}
